import stylish from './stylish';
import type { Diff, FormattersUnion } from '../types';

const formatters = {
  stylish,
};

export default (diff: Diff[], formatter: FormattersUnion): string => formatters[formatter](diff);
