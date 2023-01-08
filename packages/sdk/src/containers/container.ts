import { container, injectable, InjectionToken } from 'tsyringe';
import { Constructor } from '../models';

/**
 * Decorator to register a service implementation
 * @param token Type's token
 */
export function Service<T extends Constructor<any>>(
  token: InjectionToken<T>,
): (ctor: T) => any {
  return (ctor: T) => {
    injectable()(ctor);
    container.register(token, ctor);
  };
}
