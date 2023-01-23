import { Constructor } from '../../../models/types/constructor';

/** Metadata key to indicate non-recursive property */
export const NonRecursiveMetadataKey = 'custom:evaluate:non-recursive';

/** Marks a property as non-recursive for the evaluators */
export function NonRecursive(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const metadata =
      Reflect.getMetadata(NonRecursiveMetadataKey, target.constructor) || [];
    metadata.push(propertyKey);

    Reflect.defineMetadata(
      NonRecursiveMetadataKey,
      metadata,
      target.constructor,
    );
  };
}

/**
 * Checks whether the property was marked as non-recursive
 * @param propertyKey Name of the property
 * @param type Object type
 * @returns Whether the property was marked as non-recursive
 */
export function hasNonRecursiveMetadata(
  propertyKey: string,
  type: Constructor<any>,
): boolean {
  const metadata: string[] =
    Reflect.getMetadata(NonRecursiveMetadataKey, type) || [];
  return metadata.indexOf(propertyKey) >= 0;
}
