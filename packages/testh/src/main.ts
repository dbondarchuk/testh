import 'reflect-metadata';
import './helpers/selenium/webDriverProxy';

import { TestRunner } from './helpers/test/testRunner';

import { LoggerFactory } from './logger/loggerFactory';
import { StepsRunner } from './helpers/steps/stepsRunner';
import { registerEvaluatorsServices } from './helpers/properties/registerServices';
import {
  ActionContainerContainerToken,
  ExtensionContainerContainerToken,
  ExtensionTypes,
  IActionExtension,
  IContainer,
  IExtensionContainer,
  ITestProviderExtension,
  loadAsync,
  LoggerFactoryContainerToken,
  setContainer,
  StepsRunnerContainerToken,
  Test,
} from '@testh/sdk';
import { DefaultContainer } from './containers/container';
import { ActionContainer } from './containers/actionContainer';
import { ExtensionContainer } from './containers/extensionContainer';

function registerServices(): void {
  setContainer(new DefaultContainer());

  IContainer.instance.registerSingleton(
    ActionContainerContainerToken,
    ActionContainer,
  );
  IContainer.instance.registerSingleton(
    ExtensionContainerContainerToken,
    ExtensionContainer,
  );

  IContainer.instance.registerSingleton(
    LoggerFactoryContainerToken,
    LoggerFactory,
  );
  IContainer.instance.registerSingleton(StepsRunnerContainerToken, StepsRunner);
  registerEvaluatorsServices();
}

async function loadBuiltInExtensions(): Promise<void> {
  await loadAsync('.extension.js', __dirname);
}

async function loadActions(): Promise<void> {
  const extensions = IContainer.instance
    .get<IExtensionContainer>(ExtensionContainerContainerToken)
    .get<IActionExtension>(ExtensionTypes.Action);

  const promises = extensions.map((extension) => extension.init());
  await Promise.all(promises);
}

async function main(args: string[]): Promise<number> {
  registerServices();

  await loadBuiltInExtensions();

  await loadActions();

  let test: Test = null;
  const providers = IContainer.instance
    .get<IExtensionContainer>(ExtensionContainerContainerToken)
    .get<ITestProviderExtension>(ExtensionTypes.TestProvider);

  for (const provider of providers) {
    const result = await provider.get(args);
    if (result) {
      test = result;
      break;
    }
  }

  if (!test) {
    console.error("Can't find a test provider for a given arguments");

    return 1;
  }

  const runner = new TestRunner(test);
  const result = await runner.run();

  return result ? 0 : 2;
}

main(process.argv.slice(2));
