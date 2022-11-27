import { Transform, TransformationType } from "class-transformer";


/**
 * Decorator to ignore properties for transformation
 * @returns Transformed object
 */
 export function Ignore() {
    return Transform((params) => {
      if (params.type === TransformationType.PLAIN_TO_CLASS) {
        return params.obj[params.key];
      }
  
      if (params.type === TransformationType.CLASS_TO_PLAIN) {
        return params.obj[params.key];
      }
  
      return params.obj[params.key];
    });
  }