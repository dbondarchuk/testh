import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  TestStepWithStepsProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';
import { VariablesContainer } from '../../models/variables/variablesContainer';
import { runTestSteps } from '../../helpers/steps/stepsRunner';

/**
 * Properties for {@link ForEachElementTestStepRunner}
 */
export class ForEachElementTestStepRunnerProperties
  extends TestStepWithStepsProperties
{
  /**
   * Elements selector
   */
  @Type(() => Selector)
  selector: Selector;
}

/** Name of the variable where each element will be stored */
export const ELEMENT_VARIABLE = 'ELEMENT';

/** Name of the variable where the zero-based index of each element will be stored */
export const ELEMENT_INDEX_VARIABLE = 'ELEMENT_INDEX';

/** Runner type aliases for {@link ForEachElementTestStepRunner} */
export const ForEachElementTestStepRunnerTypeAliases = ['for-each-element'] as const;

/**
 * Runs specified test step for each of the elements of the selector.
 * @parameters {@link ForEachElementTestStepRunnerProperties}
 * @runnerType {@link ForEachElementTestStepRunnerTypeAliases}
 * @variable {@link ELEMENT_VARIABLE} Where current element is stored
 * @variable {@link ELEMENT_INDEX_VARIABLE} Where the index of current element is stored
 */
@Register(ForEachElementTestStepRunnerProperties, ...ForEachElementTestStepRunnerTypeAliases)
export class ForEachElementTestStepRunner extends ITestStepRunner<ForEachElementTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ForEachElementTestStepRunnerProperties,
    private readonly loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ForEachElementTestStepRunner>(
      ForEachElementTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    const elements = await state.currentDriver.findElements(selector.by);
    const basicStepNumber = state.variables.get(VariablesContainer.TASK_STEP_NUMBER);

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${elements.length} elements`,
    );

    let elementNumber = 0;
    for (const element of elements) {
      state.variables.put(ELEMENT_VARIABLE, element);
      state.variables.put(ELEMENT_INDEX_VARIABLE, elementNumber);

      await runTestSteps(
        this.props.steps,
        state,
        this.logger,
        this.loggerFactory,
        (stepNumber) => `${basicStepNumber}.${elementNumber}-${stepNumber++}`,
      );

      elementNumber++;
    }

    this.logger.info(`Successfully run all steps for all elements`);
  }
}
