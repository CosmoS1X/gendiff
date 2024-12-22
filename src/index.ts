import path from 'path';
import { readFile } from 'fs/promises';
import parse from './parsers';
import makeDiff from './makeDiff';
import formatDiff from './formatters';
import type { FormatsUnion, FormattersUnion } from './types';

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

export default async (filepath1: string, filepath2: string, formatter: FormattersUnion = 'stylish'): Promise<string> => {
  const data1 = await getData(filepath1);
  const data2 = await getData(filepath2);
  const parsedData1 = parse(data1, getFormat(filepath1));
  const parsedData2 = parse(data2, getFormat(filepath2));
  const diff = makeDiff(parsedData1, parsedData2);

  return `{\n${formatDiff(diff, formatter)}\n}`;
};
