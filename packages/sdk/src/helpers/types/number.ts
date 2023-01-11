import { Transform, TransformationType } from 'class-transformer';

/**
 * Decorator to transform number item
 * @returns Transformed object
 */
export function ToNumber(): PropertyDecorator {
  return Transform((params): number | any => {
    if (params.type === TransformationType.PLAIN_TO_CLASS) {
      if (typeof params.value === 'number') return params.value;

      return params.value ? Number(params.value) : params.value;
    }

    if (params.type === TransformationType.CLASS_TO_PLAIN) {
      return params.value;
    }

    return params.value;
  });
}
