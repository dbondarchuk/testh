import {
  Action,
  getCurrentStepNumber,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  TestStepsAction,
  ToTestStepsAction,
  updateStepNumber,
} from '@testh/sdk';

export class ForEachArrayItemActionProperties implements IActionProperties {
  /** Array to iterate over */
  array: any[];

  /** Steps to run */
  @ToTestStepsAction()
  steps: TestStepsAction;
}

/** Name of the variable where each item of {@link ForEachArrayItemActionProperties.array} is stored */
export const ITEM_VARIABLE = 'ITEM';

/** Name of the variable where indexes for the items of {@link ForEachArrayItemActionProperties.array} is stored */
export const INDEX_VARIABLE = 'INDEX';

/** Action type aliases for {@link ForEachArrayItemAction} */
export const ForEachArrayItemActionTypeAliases = [
  'for-each',
  'for-each-item',
  'for-each-array-item',
] as const;

/**
 * Runs specified test steps for each of the item in the array.
 * @properties {@link ForEachArrayItemActionProperties}
 * @runnerType {@link ForEachArrayItemActionTypeAliases}
 * @variable {@link ITEM_VARIABLE} Item
 * @variable {@link INDEX_VARIABLE} Item zero-based index
 * @returns {Array<any>} Array of last step results for each item
 */
@Action(
  ForEachArrayItemActionProperties,
  'Do for each array item',
  ...ForEachArrayItemActionTypeAliases,
)
export class ForEachArrayItemAction extends IAction<
  ForEachArrayItemActionProperties,
  any[]
> {
  private readonly logger: ILogger;
  constructor(
    props: ForEachArrayItemActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<ForEachArrayItemAction>(
      ForEachArrayItemAction,
    );
  }

  public async run(state: IState): Promise<any[]> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${this.props.array.length} items`,
    );

    const basicStepNumber = getCurrentStepNumber(state.variables);

    let index = 0;
    const results = [];
    for (const item of this.props.array) {
      state.variables.put(ITEM_VARIABLE, item);
      state.variables.put(INDEX_VARIABLE, index);

      updateStepNumber(state.variables, `${basicStepNumber}.${index}`);

      const result = await this.props.steps.execute(state);
      results.push(result[result.length - 1]);

      index++;
    }

    this.logger.info(`Succesfully run all steps for all items`);
    return results;
  }
}
