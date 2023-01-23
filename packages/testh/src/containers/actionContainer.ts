import {
  ActionImplementationType,
  Constructor,
  IAction,
  IActionContainer,
  IActionProperties,
} from '@testh/sdk';

/** Default implementaion of the action registry */
export class ActionContainer implements IActionContainer {
  private implementations: Record<string, ActionImplementationType<any>> = {};

  /** @inheritdoc */
  public get(): Record<string, ActionImplementationType<any>> {
    return this.implementations;
  }

  /** @inheritdoc */
  public register<
    T extends Constructor<IAction<Props, any>>,
    Props extends IActionProperties,
  >(
    ctor: T,
    propertiesType: Constructor<Props>,
    defaultStepName: string,
    aliases: string[],
  ): void {
    if (!aliases) {
      throw new TypeError('Test step names are required');
    }

    const implementation: ActionImplementationType<T> = {
      propertiesType,
      defaultStepName,
      ctor,
    };

    aliases.forEach((alias) => (this.implementations[alias] = implementation));
  }
}
