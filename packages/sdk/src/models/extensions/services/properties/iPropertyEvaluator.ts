import { resolveAll } from '../../../../containers/container';
import { Constructor } from '../../../types/constructor';
import { Variables } from '../../../variables';

/**
 * Describes generic key-value item
 */
export interface KeyValue {
  /** Property key */
  key: string;

  /** Property value */
  value: any;
}

/** Describes a property evaluator */
export abstract class IPropertyEvaluator {
  private _next: IPropertyEvaluator;
  private _first: IPropertyEvaluator;

  /** Gets evaluator priority. Higher values will be executed first */
  public abstract get priority(): number;

  /**
   * Indicates how the property key is parsed.
   * @param key Property key
   * @returns Parsed key.
   */
  public abstract parseKey(key: string): string;

  /**
   * Sets next evaluator in the chain
   * @param next Next evluator in the chain
   */
  public setNext(next: IPropertyEvaluator): void {
    this._next = next;
  }

  /**
   * Sets the first evaluator in the chain
   * @param first First evluator in the chain
   */
  public setFirst(first: IPropertyEvaluator): void {
    this._first = first;
  }

  /**
   * Runs the evaluation
   * @param property Property to evaluate
   * @param variables Variables to use
   * @param recursive Determines whether the evaluation should be recursive
   * @param type Object's type
   */
  public abstract evaluate(
    property: KeyValue,
    variables: Variables,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<void>;

  /**
   * Runs the next evaluator
   * @param property Property to evaluate
   * @param variables Variables to use
   * @param recursive Determines whether the evaluation should be recursive
   * @param type Object's type
   */
  protected async next(
    property: KeyValue,
    variables: Variables,
    recursive: boolean,
    type: Constructor<any> | undefined,
  ): Promise<void> {
    if (this._next) {
      await this._next.evaluate(property, variables, recursive, type);
    }
  }

  protected nextParseKey(key: string): string {
    if (this._next) {
      return this._next.parseKey(key);
    }

    return key;
  }

  /**
   * Runs the first evaluator
   * @param property Property to evaluate
   * @param variables Variables to use
   * @param recursive Determines whether the evaluation should be recursive
   * @param type Object's type
   */
  protected async first(
    property: KeyValue,
    variables: Variables,
    recursive: boolean,
    type?: Constructor<any>,
  ): Promise<void> {
    await this._first.evaluate(property, variables, recursive, type);
  }

  protected firstParseKey(key: string): string {
    return this._first.parseKey(key);
  }
}

/**
 * Returns all property evaluators, sorted by priority
 * @returns All priority evaluators
 */
export function getPropertyEvaluators(): IPropertyEvaluator {
  const evaluators = resolveAll<IPropertyEvaluator>(
    PropertyEvaluatorInjectionToken,
  ).sort((a, b) => b.priority - a.priority);

  const evaluator = evaluators[0];
  let current = evaluator;
  current.setFirst(evaluator);
  for (let i = 1; i < evaluators.length; i++) {
    current.setNext(evaluators[i]);
    current.setFirst(evaluator);
    current = evaluators[i];
  }

  return evaluator;
}

/** Token to use in order to get property evaluator implementation from DI container */
export const PropertyEvaluatorInjectionToken = 'PropertyEvaluator';
