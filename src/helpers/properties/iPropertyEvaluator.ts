import { State } from "../../models/actions/testRunState";

export interface KeyValue {
    key: string;
    value: any;
}

export abstract class IPropertyEvaluator {
    private _next: IPropertyEvaluator;
    private _first: IPropertyEvaluator;

    public abstract get priority(): number;

    public setNext(next: IPropertyEvaluator): void {
        this._next = next;
    }

    public setFirst(first: IPropertyEvaluator): void {
        this._first = first;
    }

    public abstract evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void>;

    public async next(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        if (this._next) {
            await this._next.evaluate(property, state, recursive);
        }
    }

    public async first(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        await this._first.evaluate(property, state, recursive);
    }
}

/** Token to use in order to get property evaluator implementation from DI container */
export const PropertyEvaluatorInjectionToken = 'PropertyEvaluator';