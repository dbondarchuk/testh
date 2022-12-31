import { Test } from '../../tests/test';
import { ExtensionType, ExtensionTypes, IExtension } from '../iExtension';

/** Describes an extension, which provides a test based on arguments */
export abstract class ITestProviderExtension extends IExtension {
  /** @inheritdoc */
  public get type(): ExtensionType {
    return ExtensionTypes.TestProvider;
  }

  /**
   * Creates a test based on the arguments.
   * If can't provide a test returns undefined
   * @param args Args to create a test
   * @returns Test or undefined if can't create it
   */
  public abstract get(args: string[]): Promise<Test | undefined>;
}
