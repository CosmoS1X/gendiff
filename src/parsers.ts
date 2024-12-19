import yaml from 'js-yaml';
import type { FormatsUnion } from './index';

type ParsersUnion = typeof JSON.parse | typeof yaml.load;

const parsers: Record<FormatsUnion, ParsersUnion> = {
  json: JSON.parse,
  yml: yaml.load,
  yaml: yaml.load,
};

export default (data: string, format: FormatsUnion) => parsers[format](data);
