/* eslint-disable */
// @ts-nocheck

import { TransformOperationExecutor } from 'class-transformer/cjs/TransformOperationExecutor';
import { isPlainObject } from '../../services/properties/propertiesEvaluator.service';

const oldTransformFn = TransformOperationExecutor.prototype.transform;
TransformOperationExecutor.prototype.transform = function transform(
  source: Record<string, any> | Record<string, any>[] | any,
  value: Record<string, any> | Record<string, any>[] | any,
  targetType: Function | TypeMetadata,
  arrayType: Function,
  isMap: boolean,
  level?: number,
): any {
  if (!isPlainObject(value)) {
    return value;
  }

  // @ts-ignore
  return oldTransformFn.apply(this, arguments);
};
