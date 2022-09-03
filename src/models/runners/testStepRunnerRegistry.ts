import { ITestStepRunner, ITestStepRunnerProperties } from './iTestStepRunner';

export type Constructor<T> = new (...args: any[]) => T;

const implementations: Record<string, TestStepRunnerImplementationType> = {};

export type TestStepRunnerImplementationType = {
  ctor: Constructor<ITestStepRunner<ITestStepRunnerProperties>>;
  propertiesType: Constructor<ITestStepRunnerProperties>;
};

/**
 * Gets all implementation of {@link ITestStepRunner}
 * @returns All implementations of {@link ITestStepRunner}
 */
export function getImplementations(): Record<
  string,
  TestStepRunnerImplementationType
> {
  return implementations;
}

/**
 * Registers test step runner with a specified names
 * @param aliases Names to register test step runner
 */
export function Register<
  T extends Constructor<ITestStepRunner<Props>>,
  Props extends ITestStepRunnerProperties,
>(propertiesType: Constructor<Props>, ...aliases: string[]): (ctor: T) => any {
  return (ctor: T) => {
    if (!aliases) {
      throw new TypeError('Test step names are required');
    }

    aliases.forEach(
      (alias) => (implementations[alias] = { propertiesType, ctor }),
    );
    return ctor as T;
  };
}
