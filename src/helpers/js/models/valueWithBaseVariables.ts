import { Variables } from "../../../models/variables/variables";

// /**
//  * Describes a container for the original value, plus its' own base variables
//  */
// export class ValueWithBaseVariables<T> {
//     /**
//      * Base variables
//      */
//     variables: Variables;

//     /**
//      * Value
//      */
//     value: T;

//     /**
//      * Creates a new instance
//      * @param value Value
//      * @param variables Base variables
//      */
//     constructor(value: T, variables?: Variables) {
//         this.value = value;
//         this.variables = variables ?? {};
//     }
// }

const metadataKey = 'VARIABLES';

export function WithVariables(variables: Variables) {
    return (target: any, propertyKey: string | symbol) =>
        Reflect.defineMetadata(metadataKey, variables, target, propertyKey);
}

export function setVariables<T>(target: T, variables: Variables): T {
    Reflect.defineMetadata(metadataKey, variables, target);
    return target;
}

export function hasVariables(target: any) {
    return target && IsObject(target) && Reflect.hasMetadata(metadataKey, target);
}

export function getVariables(target: any): Variables {
    return Reflect.getMetadata(metadataKey, target);
}

export function IsObject(x: any) {
    return typeof x === "object" ? x !== null : typeof x === "function";
}

export class WrapperWithVariables<T> extends Array<T> {
    variables: Variables;
}