import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner, TestStepWithStepsProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { VariablesContainer } from '../../models/variables/variablesContainer';
import { InvalidOperationException } from '../../models/exceptions/invalidOperationException';
import { runTestSteps } from '../../helpers/steps/stepsRunner';

export class ForEachArrayItemTestStepRunnerProperties extends TestStepWithStepsProperties
{
  array: any[];
}

/** Name of the variable where each item of {@link ForEachArrayItemTestStepRunnerProperties.array} */
export const ITEM_VARIABLE = 'ITEM';

/** Name of the variable where indexes for the items of {@link ForEachArrayItemTestStepRunnerProperties.array} */
export const INDEX_VARIABLE = 'INDEX';

/** Runner type aliases for {@link ForEachArrayItemTestStepRunner} */
export const ForEachArrayItemTestStepRunnerTypeAliases = ['for-each-item', 'for-each-array-item',] as const;

/**
 * Runs specified test step for each of the item in the array.
 * @properties {@link ForEachArrayItemTestStepRunnerProperties}
 * @runnerType {@link ForEachArrayItemTestStepRunnerTypeAliases}
 * @variable {@link ITEM_VARIABLE} Item
 * @variable {@link INDEX_VARIABLE} Item zero-based index
 */
@Register(
  ForEachArrayItemTestStepRunnerProperties,
  ...ForEachArrayItemTestStepRunnerTypeAliases
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

    const basicStepNumber = state.variables.get(VariablesContainer.TASK_STEP_NUMBER);

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
