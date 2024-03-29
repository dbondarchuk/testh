import 'reflect-metadata';
import './helpers/selenium/webDriverProxy';
import './helpers/class-transformer/plainToClass';

import {
  ActionContainerInjectionToken,
  ExtensionContainerInjectionToken,
  IExtension,
  IExtensionContainer,
  ITestProvider,
  ITestRunner,
  loadAsync,
  resolveAll,
  Settings,
  SettingsInjectionToken,
  Test,
  TestProviderInjectionToken,
  TestRunnerInjectionToken,
} from '@testh/sdk';
import { ActionContainer } from './containers/actionContainer';
import { ExtensionContainer } from './containers/extensionContainer';
import { env } from 'process';
import { readdir } from 'fs/promises';
import { existsSync, lstatSync } from 'fs';
import { join, resolve } from 'path';
import { container } from 'tsyringe';
import * as commandLineArgs from 'command-line-args';
import { YamlInclude } from 'yaml-js-include';
import { compare, satisfies } from 'semver';

const consoleArgsDefinitions: commandLineArgs.OptionDefinition[] = [
  {
    name: 'settings',
    alias: 's',
    type: String,
  },
  {
    name: 'test',
    type: String,
    multiple: true,
    defaultOption: true,
  },
];

function registerContainers(): void {
  container.registerSingleton(ActionContainerInjectionToken, ActionContainer);

  container.registerSingleton(
    ExtensionContainerInjectionToken,
    ExtensionContainer,
  );
}

async function loadBuiltInExtensions(): Promise<void> {
  await loadAsync('.extension.js', __dirname);
}

async function loadExtensions(): Promise<void> {
  const extensionsFolder = env.TESTH_EXTENSION_FOLDER || 'extensions';
  console.log(extensionsFolder);
  if (!existsSync(extensionsFolder)) return;

  const folders = await readdir(extensionsFolder);
  const packages = folders
    .map((folder) => join(extensionsFolder, folder))
    .filter((folder) => lstatSync(folder).isDirectory())
    .filter((folder) => existsSync(join(folder, 'package.json')))
    .map((folder) => resolve(folder));

  const promises = packages.map((pkg) => import(pkg));
  await Promise.all(promises);
}

async function initExtensions(): Promise<void> {
  const settings = container.resolve<Settings>(SettingsInjectionToken);

  const extensions = Object.entries(
    container
      .resolve<IExtensionContainer>(ExtensionContainerInjectionToken)
      .getAll()
      .filter((extension) => {
        if (settings?.extensions?.[extension.name]?.enabled === false)
          return false;
        const version = settings?.extensions?.[extension.name]?.version;

        if (version && !satisfies(extension.version, version)) return false;

        return true;
      })
      .reduce((group, extension) => {
        if (!group[extension.name]) group[extension.name] = [];
        group[extension.name].push(extension);

        return group;
      }, {} as { [name: string]: IExtension[] }),
  )
    .map(([name, list]) => {
      const selected = list.sort((a, b) => -compare(a.version, b.version))[0];
      console.debug(
        `Selected version ${selected.version} for the extension '${name}'`,
      );

      return selected;
    })
    .sort((a, b) => {
      let aPriority = a.priority;
      let bPriority = b.priority;
      if (settings?.extensions?.[a.name]?.priority) {
        aPriority = settings?.extensions?.[a.name]?.priority;
      }

      if (settings?.extensions?.[b.name]?.priority) {
        bPriority = settings?.extensions?.[b.name]?.priority;
      }

      return aPriority - bPriority;
    });

  for (const extension of extensions) {
    await extension.init();
  }
}

async function resolveSettings(filePath: string): Promise<void> {
  const settings = await new YamlInclude().loadAsync(filePath);

  container.registerInstance(SettingsInjectionToken, settings);
}

async function main(): Promise<number> {
  const args = commandLineArgs(consoleArgsDefinitions);
  if (args.settings) {
    await resolveSettings(args.settings);
  } else {
    container.registerInstance(SettingsInjectionToken, {});
  }

  registerContainers();

  await loadBuiltInExtensions();
  await loadExtensions();
  await initExtensions();

  let test: Test = null;
  const providers = resolveAll<ITestProvider>(TestProviderInjectionToken);

  for (const provider of providers) {
    const result = await provider.get(args.test);
    if (result) {
      test = result;
      break;
    }
  }

  if (!test) {
    console.error("Can't find a test provider for a given arguments");

    return 1;
  }

  const runner = container.resolve<ITestRunner>(TestRunnerInjectionToken);
  const result = await runner.run(test);

  return result ? 0 : 2;
}

main();
