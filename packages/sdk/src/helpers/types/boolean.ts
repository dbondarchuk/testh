import { Transform, TransformationType } from 'class-transformer';

/**
 * Decorator to transform boolean item
 * @returns Transformed object
 */
export function ToBoolean(): PropertyDecorator {
  return Transform((params): boolean | any => {
    if (params.type === TransformationType.PLAIN_TO_CLASS) {
      if (typeof params.value === 'boolean') return params.value;
      return params.value?.toLowerCase() === 'true';
    }

    if (params.type === TransformationType.CLASS_TO_PLAIN) {
      return params.value;
    }

    return params.value;
  });
}
