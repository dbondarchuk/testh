import { Expose } from "class-transformer";
import { Variables } from "../variables/variables";
import { stepsWrapper, TestStep, TestSteps } from "./testStep";
import { setEvaluateOnlyIfString } from "../../helpers/js/models/evaluateOnlyIfString";

/**
 * Describes a Page Object model
 */
export class Page {
    /** 
     * Unique name to be used in tests
     */
    name: string;

    /** 
     * Human friendly display name
     */
    displayName: string;

    /**
     * List of predefined variables. Will be merged with variables from the test execution. Test's variables will have higher priority.
     */
    variables?: Variables;

    /**
     * Map of the page actions (pairs of name and steps to execute).
     * Exposed to the parsing only
     */
    @Expose({ toClassOnly: true, name: 'actions'})
    _actions: Record<string, TestStep[]>;

    /**
     * Map of the page actions (pairs of name and steps to execute).
     * Exposed for the actual work
     */
    @Expose({ toPlainOnly: true, name: 'actions'})
    public get actions(): Record<string, TestSteps> {
        const result =  Object.keys(this._actions).reduce((obj, key) => {
            obj[key] = stepsWrapper(setEvaluateOnlyIfString(this._actions[key]), this.variables);
            return obj;
        }, {});

        return result;
    }
}