import { DiffTypes } from '../makeDiff';
import type { Diff } from '../types';

const formatValue = (value: unknown): string => {
  if (typeof value === 'string') {
    return `'${value}'`;
  }

  if (value instanceof Object) {
    return '[complex value]';
  }

  return String(value);
};

const formatDiff = (diff: Diff[], path = ''): string => {
  const formattedDiff = diff.flatMap(({ key, type, value, newValue, children }) => {
    const fullPath = path ? `${path}.${key}` : key;

    switch (type) {
      case DiffTypes.Added:
        return `Property '${fullPath}' was added with value: ${formatValue(value)}`;
      case DiffTypes.Deleted:
        return `Property '${fullPath}' was removed`;
      case DiffTypes.Changed:
        return `Property '${fullPath}' was updated. From ${formatValue(value)} to ${formatValue(newValue)}`;
      case DiffTypes.Nested:
        return formatDiff(children as Diff[], fullPath);
      case DiffTypes.Unchanged:
        return [];
      /* istanbul ignore next */
      default:
        throw new Error(`Unknown type: ${type}`);
    }
  });

  return formattedDiff.join('\n');
};

export default formatDiff;
