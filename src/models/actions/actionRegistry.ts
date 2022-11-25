import { IAction } from './iAction';
import { IActionProperties } from './iActionProperties';

export type Constructor<T> = new (...args: any[]) => T;

const implementations: Record<
  string,
  ActionImplementationType<any>
> = {};

export type ActionImplementationType<T> = {
  ctor: Constructor<IAction<IActionProperties, T>>;
  propertiesType: Constructor<IActionProperties>;
};

/**
 * Gets all implementation of {@link IAction}
 * @returns All implementations of {@link IAction}
 */
export function getImplementations(): Record<
  string,
  ActionImplementationType<any>
> {
  return implementations;
}

/**
 * Registers test step runner with a specified names
 * @param aliases Names to register test step runner
 */
export function Register<
  T extends Constructor<IAction<Props, any>>,
  Props extends IActionProperties,
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
