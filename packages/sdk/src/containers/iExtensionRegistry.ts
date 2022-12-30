import { ExtensionType, IExtension } from "../models/extensions/iExtension";
import { Constructor } from "../models/types/constructor";
import { IContainer } from "./iContainer";

/** Describes a registry for the extensions */
export abstract class IExtensionContainer {
    /** 
     * Gets all registered extensions for the specific type, sorted by priority
     * @param type Type of the extension
     */
    public abstract get<T extends IExtension>(type: ExtensionType): T[];

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
export function Extension<T extends Constructor<IExtension>>(): (ctor: T) => any {
    return (ctor: T) => {
      const container = IContainer.instance;
      const extension = new ctor(container);
      
      container.get<IExtensionContainer>(ExtensionContainerContainerToken).register(extension);      
    };
  }

  /** Token to use in order to get extension container implementation from DI container */
  export const ExtensionContainerContainerToken = 'ExtensionContainer';