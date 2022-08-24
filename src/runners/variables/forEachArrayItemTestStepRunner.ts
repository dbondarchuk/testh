import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { TestStep } from '../../models/tests/testStep';
import { Variables } from '../../models/tests/variables';
import { InvalidOperationException } from '../../models/exceptions/invalidOperationException';
import { runTestSteps } from '../../helpers/steps/stepsRunner';

export class ForEachArrayItemTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  array: any[];

  steps: TestStep[];
}

export const ITEM_VARIABLE = 'ITEM';
export const INDEX_VARIABLE = 'INDEX';

/**
 * Runs specified test step for each of the elements of the selector.
 * Each element will be stored in variable ELEMENT
 */
@Register(
  ForEachArrayItemTestStepRunnerProperties,
  'for-each-item',
  'for-each-array-item',
)
export class ForEachArrayItemTestStepRunner extends ITestStepRunner<ForEachArrayItemTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ForEachArrayItemTestStepRunnerProperties,
    private readonly loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ForEachArrayItemTestStepRunner>(
      ForEachArrayItemTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    if (!Array.isArray(this.props.array)) {
      throw new InvalidOperationException(`Property is not an array`);
    }

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${this.props.array.length} items`,
    );

    const basicStepNumber = state.variables.get(Variables.TASK_STEP_NUMBER);

    let index = 0;
    for (const item of this.props.array) {
      state.variables.put(ITEM_VARIABLE, item);
      state.variables.put(INDEX_VARIABLE, index);

      await runTestSteps(
        this.props.steps,
        state,
        this.logger,
        this.loggerFactory,
        (stepNumber) => `${basicStepNumber}.${index}-${stepNumber++}`,
      );

      index++;
    }

    this.logger.info(`Succesfully run all steps for all items`);
  }
}
