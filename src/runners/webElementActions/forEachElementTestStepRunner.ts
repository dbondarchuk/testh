import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';
import { TestStep } from '../../models/tests/testStep';
import { Variables } from '../../models/tests/variables';
import { runTestSteps } from '../../helpers/steps/stepsRunner';

export class ForEachElementTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  @Type(() => Selector)
  selector: Selector;

  steps: TestStep[];
}

export const ELEMENT_VARIABLE = 'ELEMENT';
export const ELEMENT_NUMBER_VARIABLE = 'ELEMENT_NUMBER';

/**
 * Runs specified test step for each of the elements of the selector.
 * Each element will be stored in variable ELEMENT
 */
@Register(ForEachElementTestStepRunnerProperties, 'for-each-element')
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
    const basicStepNumber = state.variables.get(Variables.TASK_STEP_NUMBER);

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${elements.length} elements`,
    );

    let elementNumber = 0;
    for (const element of elements) {
      state.variables.put(ELEMENT_VARIABLE, element);
      state.variables.put(ELEMENT_NUMBER_VARIABLE, elementNumber);

      await runTestSteps(
        this.props.steps,
        state,
        this.logger,
        this.loggerFactory,
        (stepNumber) => `${basicStepNumber}.${elementNumber}-${stepNumber++}`,
      );

      elementNumber++;
    }

    this.logger.info(`Succesfully run all steps for all elements`);
  }
}
