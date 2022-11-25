import { injectable, inject } from 'tsyringe';

import { State } from "../../../models/actions/testRunState";
import { TestSteps } from '../../../models/tests/testSteps';
import { getCurrentStepNumber } from "../../../models/variables";
import { IStepsRunner, StepsRunnerInjectionToken } from "../../steps/iStepsRunner";
import { IPropertiesEvaluator, PropertiesEvaluatorInjectionToken } from "../iPropertiesEvaluator";
import { IPropertyEvaluator, KeyValue } from "../iPropertyEvaluator";

@injectable()
export class RunActionsPropertyEvaluator extends IPropertyEvaluator{
    public constructor(
        @inject(PropertiesEvaluatorInjectionToken) protected readonly propertiesEvaluator: IPropertiesEvaluator,
        @inject(StepsRunnerInjectionToken) protected readonly stepsRunner: IStepsRunner) {
        super();
    }

    public get priority(): number {
        return 3;
    }

    public async evaluate(property: KeyValue, state: State, recursive: boolean): Promise<void> {
        if (property.key.startsWith('^') || property.key.startsWith('<')) {
            const shouldBeArray = property.key[0] === '<';
            property.key = property.key.substring(1);

            const steps =
                typeof property.value === 'string'
                    ? await this.propertiesEvaluator.evaluateProperties(property.value, state, false)
                    : property.value;
            const baseStepNumber = getCurrentStepNumber(state.variables);
            const results = await this.stepsRunner.runTestSteps(
                (Array.isArray(steps) ? steps : [steps]) as TestSteps,
                state,
                (stepNumber) => `${baseStepNumber}-execute-${stepNumber}`,
            );

            property.value = Array.isArray(steps) || shouldBeArray ? results : results[0];
        
            await super.first(property, state, recursive);
        } else {        
            await super.next(property, state, recursive);
        }
    }

}