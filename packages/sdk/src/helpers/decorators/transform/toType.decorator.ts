import 'reflect-metadata';

import { Constructor } from '../../../models';

import { Type as ToTypeInternal } from 'class-transformer';

/**
 * Decorator to transform an item to type
 * @param typeFunction Function that returns a type to which to transform
 * @returns Transformed object
 */
export function ToType(
  typeFunction: () => Constructor<any>,
): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    //SkipEvaluate()(target, propertyKey);

    ToTypeInternal(typeFunction)(target, propertyKey);
  };
}
