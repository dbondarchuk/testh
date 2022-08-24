import { JsEngine } from '../../helpers/js/jsEngine';
import { Variables } from './variables';

/**
 * Describes a test step value
 */
export interface TestStep {
  /**
   * Type of the test
   */
  type: string;

  /**
   * Is this test step disabled
   */
  disabled?: boolean;

  /**
   * Should this step run even when test is already failed
   */
  runOnFailure?: boolean;

  /**
   * Should error produced by this step ignored
   */
  ignoreError?: boolean;

  /**
   * Boolean JS condition to determine if step should be run
   */
  condition?: string;

  /**
   *  Name of this step
   */
  name: string;

  /**
   * Values of the step properties
   */
  values: Record<string, any>;
}

// /**
//  * Gets string property from the step
//  * @param step Test step
//  * @param property Property name
//  * @param variables If provided, will try evaluate using variables
//  * @returns {string} Property value
//  */
// export const getString = (
//   step: TestStep,
//   property: string,
//   variables?: Variables,
// ): string | undefined => {
//   const val = step.values[property];
//   if (!val) return undefined;

//   const value = val.toString();
//   return variables ? JsEngine.replaceVariables(value, variables) : value;
// };

// /**
//  * Gets string property from the step
//  * @param step Test step
//  * @param property Property name
//  * @param variables If provided, will try evaluate using variables
//  * @returns {boolean} Property value
//  */
// export const getBoolean = (
//   step: TestStep,
//   property: string,
//   variables?: Variables,
// ): boolean => getString(step, property, variables) === 'true';

// /**
//  * Gets map property from the step
//  * @param step Test step
//  * @param property Property name
//  * @param variables If provided, will try evaluate keys and values using variables
//  * @returns {Record<string, string>} Property value
//  */
// export const getMap = (
//   step: TestStep,
//   property: string,
//   variables?: Variables,
// ): Record<string, string> | undefined => {
//   const result: Record<string, string> = {};

//   const propertyValue = step.values[property] as Record<string, any>;
//   if (!propertyValue) return undefined;

//   for (let key in propertyValue) {
//     let value = propertyValue.get('value');

//     key = variables ? JsEngine.replaceVariables(key, variables) : key;
//     value = variables ? JsEngine.replaceVariables(value, variables) : value;

//     result[key] = value;
//   }

//   return result;
// };

// /**
//  * Gets integer property from the step
//  * @param step Test step
//  * @param property Property name
//  * @param variables If provided, will try evaluate using variables
//  * @returns {number} Integer number
//  */
// export const getInteger = (
//   step: TestStep,
//   property: string,
//   variables?: Variables,
// ): number | undefined => {
//   const strValue = getString(step, property, variables);
//   return strValue ? parseInt(strValue) : undefined;
// };

// /**
//  * Gets float property from the step
//  * @param step Test step
//  * @param property Property name
//  * @param variables If provided, will try evaluate using variables
//  * @returns {number} Float number
//  */
// export const getFloat = (
//   step: TestStep,
//   property: string,
//   variables?: Variables,
// ): number | undefined => {
//   const strValue = getString(step, property, variables);
//   return strValue ? parseFloat(strValue) : undefined;
// };
// /**
//  * Gets selector property from the step
//  * @param step Test step
//  * @param property Property name
//  * @param variables If provided, will try evaluate keys and values using variables
//  * @returns {Selector} Property value
//  */
// export const getSelector = (
//   step: TestStep,
//   property: string,
//   variables?: Variables,
// ): Selector | undefined => {
//   const propertyValue = step.values[property] as Selector;
//   if (!propertyValue) return undefined;

//   if (variables) {
//     propertyValue.type = JsEngine.replaceVariables(
//       propertyValue.type,
//       variables,
//     );
//     propertyValue.value = JsEngine.replaceVariables(
//       propertyValue.value,
//       variables,
//     );
//   }

//   return Object.assign(new Selector(), propertyValue);
// };

/**
 * Gets step properties and evaluates using variables
 * @param step Test step
 * @param variables If provided, will try evaluate using variables
 * @returns {Record<string,any>} Step properties
 */
export const getProperties = async (
  step: TestStep,
  variables?: Variables,
): Promise<Record<string, any>> => {
  if (!variables) return step.values;

  return await JsEngine.evaluateProperties(step.values, variables);
};
