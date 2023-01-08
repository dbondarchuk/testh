import { Constructor } from '../models/types/constructor';
import { IAction } from '../models/actions/iAction';
import { IActionProperties } from '../models/actions/iActionProperties';
import { container } from 'tsyringe';

/**
 * Container for the Action's required types
 */
export type ActionImplementationType<T> = {
  /** Action constructor */
  ctor: Constructor<IAction<IActionProperties, T>>;

  /** Action properties type */
  propertiesType: Constructor<IActionProperties>;
};

/** Describes an Action Registry */
export abstract class IActionContainer {
  /**
   * Gets all implementation of {@link IAction}
   * @returns All implementations of {@link IAction}
   */
  public abstract get(): Record<string, ActionImplementationType<any>>;

  /**
   * Registers test step action with a specified names
   * @param ctor Constructor for the Action
   * @param propertiesType Type of the action properties
   * @param aliases Names to register test step action by
   * @typeParam T Type of the action
   * @typeParam Props Type of the action properties
   */
  public abstract register<
    T extends Constructor<IAction<Props, any>>,
    Props extends IActionProperties,
  >(ctor: T, propertiesType: Constructor<Props>, ...aliases: string[]): void;
}

/**
 * Decorator to register test step action
 * @param aliases Names to register test step runner
 * @typeParam T Type of the action
 * @typeParam Props Type of the action properties
 */
export function Action<
  T extends Constructor<IAction<Props, any>>,
  Props extends IActionProperties,
>(propertiesType: Constructor<Props>, ...aliases: string[]): (ctor: T) => any {
  return (ctor: T) => {
    container
      .resolve<IActionContainer>(ActionContainerInjectionToken)
      .register(ctor, propertiesType, ...aliases);
    return ctor as T;
  };
}

/** Token to use in order to get action container implementation from DI container */
export const ActionContainerInjectionToken = 'ActionContainer';
