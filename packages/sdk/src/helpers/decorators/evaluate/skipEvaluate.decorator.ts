import { Constructor } from '../../../models/types/constructor';

/** Metadata key to indicate property which should be skipped during evaluation */
export const SkipEvaluateMetadataKey = 'custom:evaluate:skip';

/** Marks a property to be skipped for the evaluators */
export function SkipEvaluate(): PropertyDecorator {
  return (target: object, propertyKey: string): void => {
    const metadata =
      Reflect.getMetadata(SkipEvaluateMetadataKey, target.constructor) || [];
    metadata.push(propertyKey);

    Reflect.defineMetadata(
      SkipEvaluateMetadataKey,
      metadata,
      target.constructor,
    );
  };
}

/**
 * Checks whether the property was marked to be skipped
 * @param propertyKey Name of the property
 * @param type Object type
 * @returns Whether the property was marked to be skipped
 */
export function hasSkipEvaluateMetadata(
  propertyKey: string,
  type: Constructor<any>,
): boolean {
  const metadata: string[] =
    Reflect.getMetadata(SkipEvaluateMetadataKey, type) || [];
  return metadata.indexOf(propertyKey) >= 0;
}
