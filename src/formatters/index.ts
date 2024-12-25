import stylish from './stylish';
import plain from './plain';
import json from './json';
import type { Diff, FormattersUnion } from '../types';

const formatters = { stylish, plain, json };

export default (diff: Diff[], formatter: FormattersUnion): string => {
  const pickedFormatter = formatters[formatter];

  if (!pickedFormatter) {
    throw new Error(`Unknown formatter name: '${formatter}'`);
  }

  return pickedFormatter(diff);
};
