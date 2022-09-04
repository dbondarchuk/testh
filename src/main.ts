import 'reflect-metadata';
import './helpers/selenium/webDriverProxy'

import * as yaml from 'js-yaml';

import { Test } from './models/tests/test';
import { TestRunner } from './runners/testRunner';
import { readFile } from 'fs/promises';
import { setBaseFile, YAML_INCLUDE_SCHEMA } from './yaml-include';

async function main(pathToTest: string): Promise<number> {
  let test: Test = null;
  // if (pathToTest?.endsWith('.json')) {
  //   test = JSON.parse(readFileSync(pathToTest).toString()) as Test;
  // } else 
  if (pathToTest?.endsWith('.yaml') || pathToTest?.endsWith('.yml')) {
    setBaseFile(pathToTest)
    const src = await readFile(pathToTest, 'utf8');
    test = yaml.load(src, { schema: YAML_INCLUDE_SCHEMA, filename: pathToTest }) as Test;
  } else {
    console.error('Unknown file type');

    return 1;
  }

  const runner = new TestRunner(test);
  const result = await runner.run();

  return result ? 0 : 2;
}

main(process.argv[2]);
