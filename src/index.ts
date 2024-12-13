import path from 'path';
import { readFile } from 'fs/promises';

type FormatsUnion = 'json';
type ParsersUnion = JSON['parse'];

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

export default async (filepath1: string, filepath2: string) => {
  const data1 = await parseData(filepath1);
  const data2 = await parseData(filepath2);

  console.log(`Data from file <${filepath1}>:`, data1);
  console.log(`Data from file <${filepath2}>:`, data2);
};
