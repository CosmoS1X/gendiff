import stylish from './stylish';
import plain from './plain';
import type { Diff, FormattersUnion } from '../types';

const formatters = {
  stylish,
  plain,
};

export default (diff: Diff[], formatter: FormattersUnion): string => {
  if (!Object.hasOwn(formatters, formatter)) {
    throw new Error(`Unknown formatter name: '${formatter}'`);
  }

  return formatters[formatter](diff);
};
