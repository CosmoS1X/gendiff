import path from 'path';
import { readFile } from 'fs/promises';
import genDiff from '../src/index';

const getFixturePath = (filename: string) => path.join(__dirname, '..', '__fixtures__', filename);

it('should compare files with stylish format', async () => {
  const json1 = getFixturePath('file1.json');
  const json2 = getFixturePath('file2.json');
  const yaml1 = getFixturePath('file1.yml');
  const yaml2 = getFixturePath('file2.yml');
  const actualJSON = await genDiff(json1, json2);
  const actualYAML = await genDiff(yaml1, yaml2);
  const expected = await readFile(getFixturePath('stylish.txt'), 'utf-8');

  expect(actualJSON).toBe(expected);
  expect(actualYAML).toBe(expected);
});
