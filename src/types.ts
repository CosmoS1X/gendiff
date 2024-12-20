import yaml from 'js-yaml';
import { DiffTypes } from './index';

export type FormatsUnion = 'json' | 'yml' | 'yaml';
export type ParsersUnion = typeof JSON.parse | typeof yaml.load;
export type ParsedData = { [key: string]: unknown };
export type DiffItem = {
  key: string,
  value: unknown,
  newValue?: unknown,
  type: DiffTypes,
};
