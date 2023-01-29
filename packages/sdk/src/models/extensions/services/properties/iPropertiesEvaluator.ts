import { IState } from '../../../tests/iState';
import { Constructor } from '../../../types';

/** Describes the properties evaluator */
export interface IPropertiesEvaluator {
  /**
   * Runs JS code with the context
   * @param code JS code
   * @param context Context
   * @returns Result of JS code evaluation
   */
  evaluate(code: string, context?: Record<string, any>): Promise<any>;

  /**
   * Replaces variables in the expression
   * @param value Value string
   * @param state Current state
   * @returns Evaluated string
   */
  replaceVariables(
    value: string,
    state: IState,
    recursive?: boolean,
  ): Promise<string | any | undefined>;

  /**
   * Recursively goes through an object properties and evaluates them
   * @param obj Object to evaluate
   * @param state Current state
   * @param type Optional type of the object
   * @param recursive Should it go through the properties recursively. @defaultValue  true
   * @param type Object's type
   * @returns Evaluated object
   */
  evaluateProperties(
    obj: any,
    state: IState,
    type?: Constructor<any>,
    recursive?: boolean,
  ): Promise<any>;
}

/** Token to use in order to get properties evaluator implementation from DI container */
export const PropertiesEvaluatorInjectionToken = 'PropertiesEvaluator';
