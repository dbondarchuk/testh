import { Priority } from '../../containers/priority';
import { ExtensionType } from './extensionTypes';

/** Base class for the extension */
export abstract class IExtension {
  /** Gets the name of the extension */
  public abstract get name(): string;

  /** Gets the type of the extension */
  public abstract get type(): ExtensionType;

  /** Gets the priority of the extension. Extensions with higher priority will be executed first */
  public abstract get priority(): Priority;

  /** Initializes the extension */
  public abstract init(): Promise<void>;
}
