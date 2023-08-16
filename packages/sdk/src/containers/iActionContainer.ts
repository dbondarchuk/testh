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

  /** Default step name if it wasn't specified in test */
  defaultStepName: string;
};

/** Describes an Action Registry */
export interface IActionContainer {
  /**
   * Gets all implementation of {@link IAction} in pair type -> {@link ActionImplementationType}
   * @returns All implementations of {@link IAction}
   */
  get(): Record<string, ActionImplementationType<any>>;

  /**
   * Registers test step action with a specified names
   * @param ctor Constructor for the Action
   * @param propertiesType Type of the action properties
   * @param defaultStepName Default step name if it wasn't specified in test
   * @param aliases Names to register test step action by
   * @typeParam T Type of the action
   * @typeParam Props Type of the action properties
   */
  register<
    T extends Constructor<IAction<Props, any>>,
    Props extends IActionProperties,
  >(
    ctor: T,
    propertiesType: Constructor<Props>,
    defaultStepName: string,
    aliases: string[],
  ): void;
}

/**
 * Decorator to register test step action
 * @param propertiesType Type of the action properties
 * @param defaultStepName Default step name if it wasn't specified in test
 * @param aliases Names to register test step action by
 * @param shortuct Action shortcut to register
 * @param shortcutBindingProperty Name of the property to which the value will be assigned in case of shortcut
 * @typeParam T Type of the action
 * @typeParam Props Type of the action properties
 */
export function Action<
  T extends Constructor<IAction<Props, any>>,
  Props extends IActionProperties,
>(
  propertiesType: Constructor<Props>,
  defaultStepName: string,
  ...aliases: string[]
): (ctor: T) => any {
  return (ctor: T) => {
    container
      .resolve<IActionContainer>(ActionContainerInjectionToken)
      .register(ctor, propertiesType, defaultStepName, aliases);
    return ctor as T;
  };
}

/** Token to use in order to get action container implementation from DI container */
export const ActionContainerInjectionToken = 'ActionContainer';
