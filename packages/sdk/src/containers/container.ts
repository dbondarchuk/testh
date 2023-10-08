import { container, inject, injectable, InjectionToken } from 'tsyringe';
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

/**
 * Parameter decorator factory that allows for interface information to be stored in the constructor's metadata
 * @param token Type's token
 * @returns The parameter decorator
 */
export function dependency(
  token: InjectionToken<any>,
): (target: any, propertyKey: string | symbol, parameterIndex: number) => any {
  return (
    target: any,
    propertyKey: string | symbol,
    parameterIndex: number,
  ): any => {
    return inject(token)(target, propertyKey, parameterIndex);
  };
}

/**
 * Resolves all implementation for the token
 * @param token Injection token
 * @returns Resolved implementations
 */
export function resolveAll<T>(token: InjectionToken<T>): T[] {
  try {
    return (container.resolveAll(token) || []).reverse();
  } catch {
    return [];
  }
}

/**
 * Resolves implementation for the token with highest priority
 * @param token Injection token
 * @returns Resolved implementation
 */
export function resolve<T>(token: InjectionToken<T>): T {
  try {
    return container.resolve(token);
  } catch {
    return null;
  }
}
