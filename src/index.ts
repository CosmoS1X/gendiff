import path from 'path';
import { readFile } from 'fs/promises';

enum DiffTypes {
  Unchanged = 'unchanged',
  Changed = 'changed',
  Deleted = 'deleted',
  Added = 'added',
}

type FormatsUnion = 'json';
type ParsersUnion = JSON['parse'];
type ParsedData = { [key: string]: unknown };
type DiffItem = {
  key: string,
  value: unknown,
  newValue?: unknown,
  type: DiffTypes,
};

const parsers: Record<FormatsUnion, ParsersUnion> = {
  json: JSON.parse,
};

const getAbsolutePath = (filepath: string) => path.resolve(process.cwd(), filepath);

const getData = (filepath: string) => readFile(getAbsolutePath(filepath), { encoding: 'utf-8' });

const getFormat = (filepath: string) => path.extname(filepath).slice(1) as FormatsUnion;

const parseData = async (filepath: string) => {
  const data = await getData(filepath);
  const format = getFormat(filepath);

  return parsers[format](data);
};

const makeDiff = (data1: ParsedData, data2: ParsedData): DiffItem[] => {
  const commonKeys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort();

  return commonKeys.map((key) => {
    if (data1[key] === data2[key]) {
      return { key, value: data1[key], type: DiffTypes.Unchanged };
    }

    if (Object.hasOwn(data1, key) && Object.hasOwn(data2, key)) {
      return { key, value: data1[key], newValue: data2[key], type: DiffTypes.Changed };
    }

    if (Object.hasOwn(data1, key)) {
      return { key, value: data1[key], type: DiffTypes.Deleted };
    }

    if (Object.hasOwn(data2, key)) {
      return { key, value: data2[key], type: DiffTypes.Added };
    }

    throw new Error('An unexpected error occurred');
  });
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
      default:
        throw new Error('Unknown diff type');
    }
  }, [] as string[]);

  return `{\n${result.join('\n')}\n}`;
};

export default async (filepath1: string, filepath2: string) => {
  const data1 = await parseData(filepath1);
  const data2 = await parseData(filepath2);
  const diff = makeDiff(data1, data2);

  return formatDiff(diff);
};
