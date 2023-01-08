import { ExtensionType, ExtensionTypes } from '../extensionTypes';
import { IExtension } from '../iExtension';

/** Describes an extension, which provides additional actions */
export abstract class IActionExtension extends IExtension {
  /** @inheritdoc */
  public get type(): ExtensionType {
    return ExtensionTypes.Action;
  }
}
