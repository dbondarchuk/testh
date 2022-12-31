import { Constructor } from '../models/types/constructor';

/** Token to identify given type */
export type ContainerToken<T = any> = string | Constructor<T> | symbol;

let Container: IContainer = null;

/** Describes basic IoC container */
export abstract class IContainer {
  /**
   * Gets implementation of the type
   * @param token Type's token
   */
  public abstract get<T>(token: ContainerToken<T>): T;

  /**
   * Gets all implementation of the type
   * @param token Type's token
   */
  public abstract getAll<T>(token: ContainerToken<T>): T[];

  /**
   * Registers specific instance as a singleton
   * @param token Type's token
   * @param instance Instance to register
   */
  public abstract registerInstance<T>(
    token: ContainerToken<T>,
    instance: T,
  ): void;

  /**
   * Registers specific a singleton
   * @param tokenFrom Token of the base
   * @param tokenTo Token of the implementation
   */
  public abstract registerSingleton<T>(
    tokenFrom: ContainerToken<T>,
    tokenTo: ContainerToken<T>,
  ): void;

  /**
   * Gets an instance of the container
   */
  public static get instance(): IContainer {
    return Container;
  }
}

/**
 * Sets a new container to be default one. Do not use
 * @param container Container to set
 */
export function setContainer(container: IContainer): void {
  Container = container;
}
