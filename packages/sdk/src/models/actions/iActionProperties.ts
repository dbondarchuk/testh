// import { Transform } from 'class-transformer';
// import { TestSteps } from '../tests/testSteps';

import 'reflect-metadata';
import { Constructor } from '../types';

/**
 * Base type for test step runner properties
 */
export type IActionProperties = Record<string, any>;

/** Metadata key for property marked as binding property */
export const BindingPropertyMetadataKey = 'custom:anotations:binding-property';

/**
 * Marks a property as a binding property for the action properties.
 * Could be used in determining binding property for the shortcut
 */
export function BindingProperty(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    Reflect.defineMetadata(
      BindingPropertyMetadataKey,
      propertyKey,
      target.constructor,
    );
  };
}

/**
 * Alias for {@link BindingProperty} to be used on the class itself
 * Marks a property as a binding property for the action properties.
 * Could be used in determining binding property for the shortcut
 * @param propertyName Name of the property to use
 */
export function BindProperty<T extends Constructor<any>>(
  propertyName: string,
): (ctor: T) => any {
  return (ctor: T): void => {
    Reflect.defineMetadata(BindingPropertyMetadataKey, propertyName, ctor);
  };
}
