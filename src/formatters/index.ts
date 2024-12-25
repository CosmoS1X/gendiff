import stylish from './stylish';
import plain from './plain';
import json from './json';
import type { Diff, FormattersUnion } from '../types';

const formatters = { stylish, plain, json };

export default (diff: Diff[], formatter: FormattersUnion): string => {
  if (!Object.hasOwn(formatters, formatter)) {
    throw new Error(`Unknown formatter name: '${formatter}'`);
  }

  return formatters[formatter](diff);
};
