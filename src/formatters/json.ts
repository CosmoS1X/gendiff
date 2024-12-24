import type { Diff } from '../types';

export default (diff: Diff[]): string => JSON.stringify(diff, null, 2);
