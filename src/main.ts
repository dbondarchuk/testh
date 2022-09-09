import 'reflect-metadata';
import './helpers/selenium/webDriverProxy';

import { container } from 'tsyringe';

import { Test } from './models/tests/test';
import { TestRunner } from './runners/testRunner';

import { YamlInclude } from 'yaml-js-include';
import { LoggerFactoryInjectionToken } from './models/logger/iLoggerFactory';
import { LoggerFactory } from './logger/loggerFactory';
import { PropertiesEvaluatorInjectionToken } from './helpers/properties/iPropertiesEvaluator';
import { PropertiesEvaluator } from './helpers/properties/propertiesEvaluator';
import { StepsRunner } from './helpers/steps/stepsRunner';
import { StepsRunnerInjectionToken } from './helpers/steps/iStepsRunner';

function registerServices() {
  container.registerSingleton(LoggerFactoryInjectionToken, LoggerFactory);
  container.registerSingleton(
    PropertiesEvaluatorInjectionToken,
    PropertiesEvaluator,
  );
  container.registerSingleton(StepsRunnerInjectionToken, StepsRunner);
}

async function main(pathToTest: string): Promise<number> {
  registerServices();

  let test: Test = null;
  // if (pathToTest?.endsWith('.json')) {
  //   test = JSON.parse(readFileSync(pathToTest).toString()) as Test;
  // } else
  if (pathToTest?.endsWith('.yaml') || pathToTest?.endsWith('.yml')) {
    const yaml = new YamlInclude();
    test = await yaml.loadAsync<Test>(pathToTest);
  } else {
    console.error('Unknown file type');

    return 1;
  }

  const runner = new TestRunner(test);
  const result = await runner.run();

  return result ? 0 : 2;
}

main(process.argv[2]);
