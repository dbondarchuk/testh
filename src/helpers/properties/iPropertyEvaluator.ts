import { State } from "../../models/actions/testRunState";

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
     * @param state Current state
     * @param recursive Determines whether the evaluation should be recursive
     */
    public abstract evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void>;

    /**
     * Runs the next evaluator
     * @param property Property to evaluate
     * @param state Current state
     * @param recursive Determines whether the evaluation should be recursive
     */
    public async next(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        if (this._next) {
            await this._next.evaluate(property, state, recursive);
        }
    }

    /**
     * Runs the first evaluator
     * @param property Property to evaluate
     * @param state Current state
     * @param recursive Determines whether the evaluation should be recursive
     */
    public async first(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        await this._first.evaluate(property, state, recursive);
    }
}

/** Token to use in order to get property evaluator implementation from DI container */
export const PropertyEvaluatorInjectionToken = 'PropertyEvaluator';