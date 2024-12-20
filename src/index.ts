import path from 'path';
import { readFile } from 'fs/promises';
import parse from './parsers';
import type {
  FormatsUnion,
  ParsedData,
  DiffItem,
} from './types';

export enum DiffTypes {
  Unchanged = 'unchanged',
  Changed = 'changed',
  Deleted = 'deleted',
  Added = 'added',
}

const formats: FormatsUnion[] = ['json', 'yml', 'yaml'];

const getAbsolutePath = (filepath: string) => path.resolve(process.cwd(), filepath);

const getData = (filepath: string) => readFile(getAbsolutePath(filepath), { encoding: 'utf-8' });

const getFormat = (filepath: string) => {
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

    switch (true) {
      case value === newValue:
        return { key, value: data1[key], type: DiffTypes.Unchanged };
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

const makeDiffString = (prefix: string, key: string, value: unknown, depth = 1) => {
  const tab = '  ';

  return `${tab.repeat(depth)}${prefix} ${key}: ${value}`;
};

const formatDiff = (diff: DiffItem[]) => {
  const result = diff.reduce((acc, { key, value, newValue, type }) => {
    switch (type) {
      case DiffTypes.Unchanged:
        return [...acc, makeDiffString(' ', key, value)];
      case DiffTypes.Changed:
        return [...acc, makeDiffString('-', key, value), makeDiffString('+', key, newValue)];
      case DiffTypes.Deleted:
        return [...acc, makeDiffString('-', key, value)];
      case DiffTypes.Added:
        return [...acc, makeDiffString('+', key, value)];
      /* istanbul ignore next */
      default:
        throw new Error(`Unknown diff type: ${type}`);
    }
  }, [] as string[]);

  return `{\n${result.join('\n')}\n}`;
};

export default async (filepath1: string, filepath2: string) => {
  const data1 = await getData(filepath1);
  const data2 = await getData(filepath2);
  const parsedData1 = parse(data1, getFormat(filepath1));
  const parsedData2 = parse(data2, getFormat(filepath2));
  const diff = makeDiff(parsedData1, parsedData2);

  return formatDiff(diff);
};
