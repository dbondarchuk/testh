import { Transform, TransformationType } from "class-transformer";

/**
 * Decorator to transform boolean item
 * @returns Transformed object
 */
 export function ToBoolean() {
    return Transform((params) => {
      if (params.type === TransformationType.PLAIN_TO_CLASS) {
        return params.value?.toLowerCase() === 'true';
      }
  
      if (params.type === TransformationType.CLASS_TO_PLAIN) {
        return params.value
      }
  
      return params.value;
    });
  }
  