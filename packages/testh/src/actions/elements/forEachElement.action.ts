import {
  Action,
  getCurrentStepNumber,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElements,
  TestStepsAction,
  ToSelectorOrElements,
  ToTestStepsAction,
  updateStepNumber,
} from '@testh/sdk';

/**
 * Properties for {@link ForEachElementAction}
 */
export class ForEachElementActionProperties implements IActionProperties {
  /**
   * Elements selector
   */
  @ToSelectorOrElements()
  selector: SelectorOrElements;

  /** Steps to run */
  @ToTestStepsAction()
  steps: TestStepsAction;
}

/** Name of the variable where each element will be stored */
export const ELEMENT_VARIABLE = 'ELEMENT';

/** Name of the variable where the zero-based index of each element will be stored */
export const ELEMENT_INDEX_VARIABLE = 'ELEMENT_INDEX';

/** Action type aliases for {@link ForEachElementAction} */
export const ForEachElementActionTypeAliases = ['for-each-element'] as const;

/**
 * Runs specified test step for each of the elements of the selector.
 * @parameters {@link ForEachElementActionProperties}
 * @runnerType {@link ForEachElementActionTypeAliases}
 * @variable {@link ELEMENT_VARIABLE} Where current element is stored
 * @variable {@link ELEMENT_INDEX_VARIABLE} Where the index of current element is stored
 * @result `Array<any>` Array of last step results for each item
 */
@Action(
  ForEachElementActionProperties,
  'Do for each element',
  ...ForEachElementActionTypeAliases,
)
export class ForEachElementAction extends IAction<
  ForEachElementActionProperties,
  any[]
> {
  private readonly logger: ILogger;
  constructor(
    props: ForEachElementActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ForEachElementAction>(ForEachElementAction);
  }

  public async run(state: IState): Promise<any[]> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    const elements = await selector.getElements(state.currentDriver);
    const basicStepNumber = getCurrentStepNumber(state.variables);

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${elements.length} elements`,
    );

    let elementNumber = 0;
    const results = [];
    for (const element of elements) {
      state.variables.put(ELEMENT_VARIABLE, element);
      state.variables.put(ELEMENT_INDEX_VARIABLE, elementNumber);

      updateStepNumber(state.variables, `${basicStepNumber}.${elementNumber}`);
      const result = await this.props.steps.execute(state);
      results.push(result[result.length - 1]);

      elementNumber++;
    }

    this.logger.info(`Successfully run all steps for all elements`);
    return results;
  }
}
