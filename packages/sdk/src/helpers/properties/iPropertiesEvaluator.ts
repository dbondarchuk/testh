import { IState } from '../../models/tests/iState';

/** Describes the properties evaluator */
export abstract class IPropertiesEvaluator {
  /**
   * Runs JS code with the context
   * @param code JS code
   * @param context Context
   * @returns Result of JS code evaluation
   */
  public abstract evaluate(
    code: string,
    context?: Record<string, any>,
  ): Promise<any>;

  /**
   * Replaces variables in the expression
   * @param value Value string
   * @param state Current state
   * @returns Evaluated string
   */
  public abstract replaceVariables(
    value: string,
    state: IState,
    recursive?: boolean,
  ): Promise<string | any | undefined>;

  /**
   * Recursively goes through an object properties and evaluates them
   * @param obj Object to evaluate
   * @param state Current state
   * @param recursive Should it go through the properties recursively
   * @returns Evaluated object
   */
  public abstract evaluateProperties(
    obj: any,
    state: IState,
    recursive?: boolean,
  ): Promise<any>;
}

/** Token to use in order to get properties evaluator implementation from DI container */
export const PropertiesEvaluatorContainerToken = 'PropertiesEvaluator';
