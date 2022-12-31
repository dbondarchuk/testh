import { ExtensionType, ExtensionTypes, IExtension } from '../iExtension';

/** Describes an extension, which provides additional actions */
export abstract class IActionExtension extends IExtension {
  /** @inheritdoc */
  public get type(): ExtensionType {
    return ExtensionTypes.Action;
  }

  /** Registers new actions, or imports files, where actions are registered via decorator */
  public abstract init(): Promise<void>;
}
