import 'reflect-metadata';
import './helpers/selenium/webDriverProxy';

import { container } from 'tsyringe';

import { TestRunner } from './actions/testRunner';

import { YamlInclude } from 'yaml-js-include';
import { LoggerFactory } from './logger/loggerFactory';
import { StepsRunner } from './helpers/steps/stepsRunner';
import { registerEvaluatorsServices } from './helpers/properties/registerServices';
import { LoggerFactoryInjectionToken, StepsRunnerInjectionToken, Test } from '@testh/sdk';

function registerServices(): void {
  container.registerSingleton(LoggerFactoryInjectionToken, LoggerFactory);
  container.registerSingleton(StepsRunnerInjectionToken, StepsRunner);
  registerEvaluatorsServices()
}

async function main(pathToTest: string): Promise<number> {
  registerServices();

  let test: Test = null;
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
