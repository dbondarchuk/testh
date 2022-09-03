import { IsObject } from "./valueWithBaseVariables";

const metadataKey = 'EVALUATE_ONLY_IF_STRING';

export function EvaluateOnlyIfString(target: any, propertyKey: string | symbol) {
    Reflect.defineMetadata(metadataKey, true, target, propertyKey);
}

export function setEvaluateOnlyIfString<T>(target: T) {
    if (target) {
        Reflect.defineMetadata(metadataKey, true, target);
    }
    return target;
}

export function isEvaluateOnlyIfStringProperty<T>(instance: T, propertyKey?: string | symbol) {
    return IsObject(propertyKey ? instance[propertyKey] : instance) && Reflect.hasMetadata(metadataKey, instance, propertyKey)
}