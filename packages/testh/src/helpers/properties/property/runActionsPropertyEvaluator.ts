import { injectable, inject } from 'tsyringe';
import { getCurrentStepNumber, IPropertiesEvaluator, IPropertyEvaluator, IState, IStepsRunner, KeyValue, PropertiesEvaluatorInjectionToken, StepsRunnerInjectionToken, TestSteps } from '@testh/sdk';

/**
 * Treats property value as steps to execute and get value.
 * If key starts with `<` sign, then steps results will be returned as an array of results from all steps
 * If key starts with '^' sign, then result of the last step will be used as a single result
 */
@injectable()
export class RunActionsPropertyEvaluator extends IPropertyEvaluator {
    public constructor(
        @inject(PropertiesEvaluatorInjectionToken) protected readonly propertiesEvaluator: IPropertiesEvaluator,
        @inject(StepsRunnerInjectionToken) protected readonly stepsRunner: IStepsRunner) {
        super();
    }

    public get priority(): number {
        return 3;
    }

    public async evaluate(property: KeyValue, state: IState, recursive: boolean): Promise<void> {
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

            property.value = Array.isArray(steps) || shouldBeArray ? results : results[results.length - 1];

            await super.first(property, state, recursive);
        } else {
            await super.next(property, state, recursive);
        }
    }

}