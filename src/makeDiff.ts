import type { ParsedData, Diff } from './types';

export enum DiffTypes {
  Unchanged = 'unchanged',
  Changed = 'changed',
  Deleted = 'deleted',
  Added = 'added',
  Nested = 'nested',
}

const makeDiff = (data1: ParsedData, data2: ParsedData): Diff[] => {
  const commonKeys = Array.from(new Set([...Object.keys(data1), ...Object.keys(data2)])).sort();

  const diff = commonKeys.map((key) => {
    const value = data1[key];
    const newValue = data2[key];
    const hasPropInData1 = Object.hasOwn(data1, key);
    const hasPropInData2 = Object.hasOwn(data2, key);
    const hasPropInBothData = hasPropInData1 && hasPropInData2;
    const hasChildren = typeof value === 'object' && typeof newValue === 'object';

    switch (true) {
      case hasChildren:
        return {
          key,
          children: makeDiff(value as ParsedData, newValue as ParsedData),
          type: DiffTypes.Nested,
        };
      case value === newValue:
        return { key, value, type: DiffTypes.Unchanged };
      case hasPropInBothData:
        return { key, value, newValue, type: DiffTypes.Changed };
      case hasPropInData1:
        return { key, value, type: DiffTypes.Deleted };
      case hasPropInData2:
        return { key, value: newValue, type: DiffTypes.Added };
      /* istanbul ignore next */
      default:
        throw new Error('An unexpected error occurred');
    }
  });

  return diff;
};

export default makeDiff;
