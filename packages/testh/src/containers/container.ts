import { ContainerToken, IContainer } from '@testh/sdk';
import { container } from 'tsyringe';

/** Default container */
export class DefaultContainer extends IContainer {
  /** @inheritdoc */
  get<T>(token: ContainerToken<T>): T {
    return container.resolve<T>(token);
  }

  /** @inheritdoc */
  getAll<T>(token: ContainerToken<T>): T[] {
    return container.resolveAll<T>(token);
  }

  /** @inheritdoc */
  registerInstance<T>(token: ContainerToken<T>, instance: T): void {
    container.registerInstance<T>(token, instance);
  }

  /** @inheritdoc */
  registerSingleton<T>(
    tokenFrom: ContainerToken<T>,
    tokenTo: ContainerToken<T>,
  ): void {
    container.registerSingleton(tokenFrom, tokenTo);
  }
}
