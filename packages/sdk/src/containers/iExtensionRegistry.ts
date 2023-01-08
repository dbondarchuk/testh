import { container } from 'tsyringe';
import { ExtensionType } from '../models';
import { IExtension } from '../models/extensions/iExtension';
import { Constructor } from '../models/types/constructor';

/** Describes a registry for the extensions */
export abstract class IExtensionContainer {
  /**
   * Gets all registered extensions for the specific type, sorted by priority
   * @param type Type of the extension
   */
  public abstract get<T extends IExtension>(type: ExtensionType): T[];

  /**
   * Gets all registered extensions, sorted by priority
   */
  public abstract getAll(): IExtension[];

  /**
   * Registers new extension
   * @param extension Extension to register
   */
  public abstract register<T extends IExtension>(extension: T): void;
}

/**
 * Decorator to register an extension
 * @param type Type of the extension
 */
export function Extension<T extends Constructor<IExtension>>(): (
  ctor: T,
) => any {
  return (ctor: T) => {
    const extension = new ctor(container);

    container
      .resolve<IExtensionContainer>(ExtensionContainerInjectionToken)
      .register(extension);
  };
}

/** Token to use in order to get extension container implementation from DI container */
export const ExtensionContainerInjectionToken = 'ExtensionContainer';
