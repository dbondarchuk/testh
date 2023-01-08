import { ExtensionType, ExtensionTypes } from '../extensionTypes';
import { IExtension } from '../iExtension';

/** Describes an extension, which provides additional services registration */
export abstract class IServiceProviderExtension extends IExtension {
  /** @inheritdoc */
  public get type(): ExtensionType {
    return ExtensionTypes.ServiceProvider;
  }
}
