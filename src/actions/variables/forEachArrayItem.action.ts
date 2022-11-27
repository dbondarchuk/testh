import { container } from 'tsyringe';

import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { getCurrentStepNumber } from '../../models/variables/variablesContainer';
import { InvalidOperationException } from '../../models/exceptions/invalidOperationException';
import { ActionWithStepsProperties } from '../../models/actions/iActionProperties';
import {
  IStepsRunner,
  StepsRunnerInjectionToken,
} from '../../helpers/steps/iStepsRunner';

export class ForEachArrayItemActionProperties extends ActionWithStepsProperties {
  array: any[];
}

/** Name of the variable where each item of {@link ForEachArrayItemActionProperties.array} */
export const ITEM_VARIABLE = 'ITEM';

/** Name of the variable where indexes for the items of {@link ForEachArrayItemActionProperties.array} */
export const INDEX_VARIABLE = 'INDEX';

/** Runner type aliases for {@link ForEachArrayItemAction} */
export const ForEachArrayItemActionTypeAliases = [
  'for-each-item',
  'for-each-array-item',
] as const;

/**
 * Runs specified test step for each of the item in the array.
 * @properties {@link ForEachArrayItemActionProperties}
 * @runnerType {@link ForEachArrayItemActionTypeAliases}
 * @variable {@link ITEM_VARIABLE} Item
 * @variable {@link INDEX_VARIABLE} Item zero-based index
 */
@Register(
  ForEachArrayItemActionProperties,
  ...ForEachArrayItemActionTypeAliases,
)
export class ForEachArrayItemAction extends IAction<ForEachArrayItemActionProperties> {
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

  public async run(state: State): Promise<void> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    if (!Array.isArray(this.props.array)) {
      throw new InvalidOperationException(`Property is not an array`);
    }

    this.logger.info(
      `Running ${this.props.steps.length} steps for ${this.props.array.length} items`,
    );

    const basicStepNumber = getCurrentStepNumber(state.variables);

    let index = 0;
    for (const item of this.props.array) {
      state.variables.put(ITEM_VARIABLE, item);
      state.variables.put(INDEX_VARIABLE, index);

      await container
        .resolve<IStepsRunner>(StepsRunnerInjectionToken)
        .runTestSteps(
          this.props.steps,
          state,
          (stepNumber) => `${basicStepNumber}.${index}-${stepNumber++}`,
        );

      index++;
    }

    this.logger.info(`Succesfully run all steps for all items`);
  }
}
