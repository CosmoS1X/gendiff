import path from 'path';
import { readFile } from 'fs/promises';
import parse from './parsers';
import type { FormatsUnion, ParsedData, DiffItem } from './types';

export enum DiffTypes {
  Unchanged = 'unchanged',
  Changed = 'changed',
  Deleted = 'deleted',
  Added = 'added',
  Nested = 'nested',
}

const formats: FormatsUnion[] = ['json', 'yml', 'yaml'];

const getAbsolutePath = (filepath: string): string => path.resolve(process.cwd(), filepath);

const getData = (filepath: string) => readFile(getAbsolutePath(filepath), { encoding: 'utf-8' });

const getFormat = (filepath: string): FormatsUnion => {
  const { base, ext } = path.parse(filepath);
  const format = ext.slice(1) as FormatsUnion;

  if (!formats.includes(format)) {
    throw new Error(`The extension '${ext}' of file '${base}' is not supported`);
  }

  return format;
};

const makeDiff = (data1: ParsedData, data2: ParsedData): DiffItem[] => {
  const commonKeys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort();

  const diff = commonKeys.map((key) => {
    const value = data1[key];
    const newValue = data2[key];
    const hasPropInData1 = Object.hasOwn(data1, key);
    const hasPropInData2 = Object.hasOwn(data2, key);
    const hasPropInBothData = hasPropInData1 && hasPropInData2;
    const hasChildren = typeof value === 'object' && typeof newValue === 'object';

    switch (true) {
      case hasChildren:
        return {
          key,
          children: makeDiff(value as ParsedData, newValue as ParsedData),
          type: DiffTypes.Nested,
        };
      case value === newValue:
        return { key, value, type: DiffTypes.Unchanged };
      case hasPropInBothData:
        return { key, value, newValue, type: DiffTypes.Changed };
      case hasPropInData1:
        return { key, value, type: DiffTypes.Deleted };
      case hasPropInData2:
        return { key, value: newValue, type: DiffTypes.Added };
      /* istanbul ignore next */
      default:
        throw new Error('An unexpected error occurred');
    }
  });

  return diff;
};

const getTab = (depth: number, offset = 0): string => {
  const tabChar = ' ';
  const tabCount = 4;

  return tabChar.repeat(depth * tabCount - offset);
};

const makeDiffString = (key: string, value: unknown, depth: number, prefix = ' '): string => {
  if (value !== null && typeof value === 'object') {
    const children = Object.entries(value)
      .map(([childKey, childValue]) => makeDiffString(childKey, childValue, depth + 1)).join('\n');

    return `${getTab(depth, 2)}${prefix} ${key}: {\n${children}\n${getTab(depth)}}`;
  }

  return `${getTab(depth, 2)}${prefix} ${key}: ${value}`;
};

const formatDiff = (diff: DiffItem[]): string => {
  const iter = (data: DiffItem[], depth = 1): string => {
    const result = data.map(({ key, value, newValue, children, type }) => {
      switch (type) {
        case DiffTypes.Nested:
          return makeDiffString(key, iter(children as DiffItem[], depth + 1), depth);
        case DiffTypes.Unchanged:
          return makeDiffString(key, value, depth);
        case DiffTypes.Changed:
          return `${makeDiffString(key, value, depth, '-')}\n${makeDiffString(key, newValue, depth, '+')}`;
        case DiffTypes.Deleted:
          return makeDiffString(key, value, depth, '-');
        case DiffTypes.Added:
          return makeDiffString(key, value, depth, '+');
        /* istanbul ignore next */
        default:
          throw new Error(`Unknown diff type: ${type}`);
      }
    }).join('\n');

    return `{\n${result}\n${getTab(depth, 4)}}`;
  };

  return iter(diff);
};

export default async (filepath1: string, filepath2: string): Promise<string> => {
  const data1 = await getData(filepath1);
  const data2 = await getData(filepath2);
  const parsedData1 = parse(data1, getFormat(filepath1));
  const parsedData2 = parse(data2, getFormat(filepath2));
  const diff = makeDiff(parsedData1, parsedData2);

  return formatDiff(diff);
};
