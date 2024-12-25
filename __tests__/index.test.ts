import path from 'path';
import { readFile } from 'fs/promises';
import genDiff from '../src/index';
import { FormattersUnion } from '../src/types';

const getFixturePath = (filename: string) => path.join(__dirname, '..', '__fixtures__', filename);

const json1 = getFixturePath('file1.json');
const json2 = getFixturePath('file2.json');
const yaml1 = getFixturePath('file1.yml');
const yaml2 = getFixturePath('file2.yml');

it('should compare files with stylish format by default', async () => {
  const stylishDiff = await readFile(getFixturePath('stylish.txt'), 'utf-8');

  await expect(genDiff(json1, json2)).resolves.toBe(stylishDiff);
  await expect(genDiff(yaml1, yaml2)).resolves.toBe(stylishDiff);
});

it('should compare files with plain format', async () => {
  const plainDiff = await readFile(getFixturePath('plain.txt'), 'utf-8');

  await expect(genDiff(json1, json2, 'plain')).resolves.toBe(plainDiff);
  await expect(genDiff(yaml1, yaml2, 'plain')).resolves.toBe(plainDiff);
});

it('should throw if the file format is not supported', async () => {
  const supported = getFixturePath('file1.json');
  const unsupported = getFixturePath('stylish.txt');

  await expect(genDiff(supported, unsupported)).rejects.toThrow();
});

it('should throw if the formatter is unknown', async () => {
  await expect(genDiff(json1, json2, 'unknown' as FormattersUnion)).rejects.toThrow();
});
