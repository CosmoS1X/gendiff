import yaml from 'js-yaml';
import { DiffTypes } from './makeDiff';

export type FormatsUnion = 'json' | 'yml' | 'yaml';
export type ParsersUnion = typeof JSON.parse | typeof yaml.load;
export type FormattersUnion = 'stylish';
export type ParsedData = { [key: string]: unknown };
export type Diff = {
  key: string,
  value?: unknown,
  newValue?: unknown,
  children?: Diff[],
  type: DiffTypes,
};
