import { DiffTypes } from '../makeDiff';
import type { Diff } from '../types';

const makeIndent = (depth: number, offset = 2): string => {
  const indentChar = ' ';
  const indentSize = 4;

  return indentChar.repeat(depth * indentSize - offset);
};

const formatValue = (value: unknown, depth: number): string => {
  if (typeof value !== 'object' || value === null) {
    return String(value);
  }

  const children = Object.entries(value).map(([childKey, childValue]) => (
    `${makeIndent(depth + 1, 0)}${childKey}: ${formatValue(childValue, depth + 1)}`
  ));

  return `{\n${children.join('\n')}\n${makeIndent(depth, 0)}}`;
};

const formatDiff = (diff: Diff[], depth: number = 1): string => {
  const formattedDiff = diff.map(({ key, type, value, newValue, children }) => {
    const indent = makeIndent(depth);

    switch (type) {
      case DiffTypes.Added:
        return `${indent}+ ${key}: ${formatValue(value, depth)}`;
      case DiffTypes.Deleted:
        return `${indent}- ${key}: ${formatValue(value, depth)}`;
      case DiffTypes.Unchanged:
        return `${indent}  ${key}: ${formatValue(value, depth)}`;
      case DiffTypes.Changed:
        return [
          `${indent}- ${key}: ${formatValue(value, depth)}`,
          `${indent}+ ${key}: ${formatValue(newValue, depth)}`,
        ].join('\n');
      case DiffTypes.Nested:
        return `${indent}  ${key}: ${formatDiff(children as Diff[], depth + 1)}`;
      /* istanbul ignore next */
      default:
        throw new Error(`Unknown diff type: ${type}`);
    }
  });

  return `{\n${formattedDiff.join('\n')}\n${makeIndent(depth, 4)}}`;
};

export default formatDiff;
