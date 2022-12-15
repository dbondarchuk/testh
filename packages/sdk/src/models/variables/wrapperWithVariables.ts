import { Variables } from './variables';

/** Wrapper for an array to have variables property */
export class WrapperWithVariables<T> extends Array<T> {
  /** Variables */
  variables: Variables;
}
