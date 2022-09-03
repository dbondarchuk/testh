import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  TestStepWithStepsProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { VariablesContainer } from '../../models/variables/variablesContainer';
import { InvalidOperationException } from '../../models/exceptions/invalidOperationException';
import { runTestSteps } from '../../helpers/steps/stepsRunner';

/**
 * Properties for {@link RunStepsTestStepRunner}
 */
export class RunStepsTestStepRunnerProperties extends TestStepWithStepsProperties
{
}

/** Runner type aliases for {@link RunStepsTestStepRunner} */
export const RunStepsTestStepRunnerTypeAliases = ['run', 'run-steps'] as const;

/**
 * Runs specified test steps
 * @properties {@link RunStepsTestStepRunnerProperties}
 * @runnerType {@link RunStepsTestStepRunnerTypeAliases}
 */
@Register(
  RunStepsTestStepRunnerProperties, ...RunStepsTestStepRunnerTypeAliases
)
export class RunStepsTestStepRunner extends ITestStepRunner<RunStepsTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: RunStepsTestStepRunnerProperties,
    private readonly loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<RunStepsTestStepRunner>(
      RunStepsTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    if (!Array.isArray(this.props.steps)) {
      throw new InvalidOperationException(`Steps is not an array`);
    }

    this.logger.info(
      `Running ${this.props.steps.length} steps`,
    );

    const basicStepNumber = state.variables.get(VariablesContainer.TASK_STEP_NUMBER);

    await runTestSteps(
      this.props.steps,
      state,
      this.logger,
      this.loggerFactory,
      (stepNumber) => `${basicStepNumber}.${stepNumber++}`,
    );

    this.logger.info(`Successfully run all steps for all items`);
  }
}
