/* eslint-disable @typescript-eslint/no-explicit-any */
import {
    ClassConstructor,
    ClassTransformOptions,
    instanceToPlain,
    plainToClass,
    Transform,
    TransformationType
  } from "class-transformer";

export type RecordTransformOptions<T, R extends Record<any, T>> = ClassTransformOptions & {
    recordType?: ClassConstructor<R>;
  };
  
  function getOptions<R extends Record<any, T>, T>(
    options: ClassTransformOptions,
    recordType: ClassConstructor<R>,
    type: ClassConstructor<T>,
    value: any,
  ): RecordTransformOptions<T, R> {
    return {
      ...options,
      targetMaps: [
        ...((options && options.targetMaps) || []),
        {
          target: recordType,
          properties: Object.entries(value).reduce((prev, [key]) => {
            return {
              ...prev,
              [key]: type,
            };
          }, {}),
        },
      ],
    };
  }
  
  export function recordToClass<R extends Record<any, T>, T>(
    type: ClassConstructor<T>,
    value: any,
    options?: RecordTransformOptions<T, R>
  ): R { 
    const recordType: ClassConstructor<R> = options?.recordType || (class InternalDictionary{
       [key: string]: T;
    } as any);
  
    return plainToClass(recordType, value, getOptions(options, recordType, type, value));
  }
  
  /**
   * This method doesn't work properly yet
   */
  export function classToRecord<R extends Record<any, T>, T>(
    type: ClassConstructor<T>,
    value: R,
    options?: RecordTransformOptions<T, R>
  ) {
    return instanceToPlain(value, getOptions(options, options?.recordType, type, value));
  }
  
  export function RecordType<T, R extends Record<any, T>>(
    itemType: ClassConstructor<T>,
    recordType?: ClassConstructor<R>
  ) {
    return Transform(params => {
      if (params.type === TransformationType.PLAIN_TO_CLASS) {
        return recordToClass(itemType, params.value, {
          ...params.options,
          recordType
        });
      }
  
      if (params.type === TransformationType.CLASS_TO_PLAIN) {
        return classToRecord(itemType, params.value, {
          ...params.options,
          recordType
        });
      }
  
      return params.value;
    });
  }