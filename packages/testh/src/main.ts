import 'reflect-metadata';
import './helpers/selenium/webDriverProxy';

import { TestRunner } from './actions/testRunner';

import { YamlInclude } from 'yaml-js-include';
import { LoggerFactory } from './logger/loggerFactory';
import { StepsRunner } from './helpers/steps/stepsRunner';
import { registerEvaluatorsServices } from './helpers/properties/registerServices';
import { ActionContainerContainerToken, ExtensionContainerContainerToken, IContainer, LoggerFactoryContainerToken, setContainer, StepsRunnerContainerToken, Test } from '@testh/sdk';
import { DefaultContainer } from './containers/container';
import { ActionContainer } from './containers/actionContainer';
import { ExtensionContainer } from './containers/extensionContainer';

function registerServices(): void {
  setContainer(new DefaultContainer());

  IContainer.instance.registerSingleton(ActionContainerContainerToken, ActionContainer);
  IContainer.instance.registerSingleton(ExtensionContainerContainerToken, ExtensionContainer);

  IContainer.instance.registerSingleton(LoggerFactoryContainerToken, LoggerFactory);
  IContainer.instance.registerSingleton(StepsRunnerContainerToken, StepsRunner);
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
