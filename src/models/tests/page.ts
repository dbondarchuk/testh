import { Expose } from "class-transformer";
import { Variables } from "../variables/variables";
import { TestStep } from "./testStep";
import { stepsWrapper, TestSteps } from "./testSteps";
import { setEvaluateOnlyIfString } from "../../helpers/js/models/evaluateOnlyIfString";

/**
 * Describes a Page Object model
 */
export class Page {
    /** 
     * Human friendly display name
     */
    name: string;

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