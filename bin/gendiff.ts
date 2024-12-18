#!/usr/bin/env node
import { program } from 'commander';
import genDiff from '../src/index';

program
  .version('1.0.0')
  .description('Compares two configuration files and shows a difference.')
  .argument('<filepath1>')
  .argument('<filepath2>')
  .option('-f, --format [type]', 'output format')
  .action(async (filepath1: string, filepath2: string) => {
    console.log(await genDiff(filepath1, filepath2));
  })
  .parse();
