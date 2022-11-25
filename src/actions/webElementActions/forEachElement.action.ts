import { container } from 'tsyringe';
import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Type } from 'class-transformer';
import { VariablesContainer } from '../../models/variables/variablesContainer';
import { ActionWithStepsProperties } from '../../models/actions/iActionProperties';
import {
  IStepsRunner,
  StepsRunnerInjectionToken,
} from '../../helpers/steps/iStepsRunner';
import { SelectorOrElements } from '../../models/selector/selectorOrElement';

/**
 * Properties for {@link ForEachElementAction}
 */
export class ForEachElementActionProperties extends ActionWithStepsProperties {
  /**
   * Elements selector
   */
  @Type(() => SelectorOrElements)
  selector: SelectorOrElements;
}

/** Name of the variable where each element will be stored */
export const ELEMENT_VARIABLE = 'ELEMENT';

/** Name of the variable where the zero-based index of each element will be stored */
export const ELEMENT_INDEX_VARIABLE = 'ELEMENT_INDEX';

/** Runner type aliases for {@link ForEachElementAction} */
export const ForEachElementActionTypeAliases = [
  'for-each-element',
] as const;

/**
 * Runs specified test step for each of the elements of the selector.
 * @parameters {@link ForEachElementActionProperties}
 * @runnerType {@link ForEachElementActionTypeAliases}
 * @variable {@link ELEMENT_VARIABLE} Where current element is stored
 * @variable {@link ELEMENT_INDEX_VARIABLE} Where the index of current element is stored
 */
@Register(
  ForEachElementActionProperties,
  ...ForEachElementActionTypeAliases,
)
export class ForEachElementAction extends IAction<ForEachElementActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: ForEachElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ForEachElementAction>(
      ForEachElementAction,
    );
  }

  public async run(state: State): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    const elements = await selector.getElements(state.currentDriver);
    const basicStepNumber = state.variables.get(
      VariablesContainer.TASK_STEP_NUMBER,
    );

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${elements.length} elements`,
    );

    let elementNumber = 0;
    for (const element of elements) {
      state.variables.put(ELEMENT_VARIABLE, element);
      state.variables.put(ELEMENT_INDEX_VARIABLE, elementNumber);
      const tt = await element.getTagName();
      console.log(tt);

      await container
        .resolve<IStepsRunner>(StepsRunnerInjectionToken)
        .runTestSteps(
          this.props.steps,
          state,
          (stepNumber) => `${basicStepNumber}.${elementNumber}-${stepNumber++}`,
        );

      elementNumber++;
    }

    this.logger.info(`Successfully run all steps for all elements`);
  }
}