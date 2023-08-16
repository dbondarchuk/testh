import { Constructor } from '../../../types';
import { Variables } from '../../../variables';

/** Describes the properties evaluator */
export interface IPropertiesEvaluator {
  /**
   * Runs JS code with the context
   * @param code JS code
   * @param context Context
   * @returns Result of JS code evaluation
   */
  evaluate(code: string, context?: Variables): Promise<any>;

  /**
   * Replaces variables in the expression
   * @param value Value string
   * @param variables Variables to use
   * @returns Evaluated string
   */
  replaceVariables(
    value: string,
    variables: Variables,
    recursive?: boolean,
  ): Promise<string | any | undefined>;

  /**
   * Recursively goes through an object properties and evaluates them
   * @param obj Object to evaluate
   * @param variables Variables to uuse
   * @param type Optional type of the object
   * @param recursive Should it go through the properties recursively. @defaultValue `true`
   * @returns Evaluated object
   */
  evaluateProperties(
    obj: any,
    variables: Variables,
    type?: Constructor<any>,
    recursive?: boolean,
  ): Promise<any>;
}

/** Token to use in order to get properties evaluator implementation from DI container */
export const PropertiesEvaluatorInjectionToken = 'PropertiesEvaluator';
