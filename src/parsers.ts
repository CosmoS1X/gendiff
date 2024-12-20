import yaml from 'js-yaml';
import type { FormatsUnion, ParsersUnion } from './types';

const parsers: Record<FormatsUnion, ParsersUnion> = {
  json: JSON.parse,
  yml: yaml.load,
  yaml: yaml.load,
};

export default (data: string, format: FormatsUnion) => parsers[format](data);
