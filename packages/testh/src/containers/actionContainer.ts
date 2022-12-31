import {
  ActionImplementationType,
  Constructor,
  IAction,
  IActionProperties,
} from '@testh/sdk';

/** Default implementaion of the action registry */
export class ActionContainer {
  private implementations: Record<string, ActionImplementationType<any>> = {};

  /** @inheritdoc */
  public get(): Record<string, ActionImplementationType<any>> {
    return this.implementations;
  }

  /** @inheritdoc */
  public register<
    T extends Constructor<IAction<Props, any>>,
    Props extends IActionProperties,
  >(ctor: T, propertiesType: Constructor<Props>, ...aliases: string[]): void {
    if (!aliases) {
      throw new TypeError('Test step names are required');
    }

    aliases.forEach(
      (alias) => (this.implementations[alias] = { propertiesType, ctor }),
    );
  }
}
