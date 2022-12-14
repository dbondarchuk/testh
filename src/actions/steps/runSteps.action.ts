import { container } from 'tsyringe';

import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { Action } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { getCurrentStepNumber } from '../../models/variables/variablesContainer';
import { InvalidOperationException } from '../../models/exceptions/invalidOperationException';
import { ActionWithStepsProperties } from '../../models/actions/iActionProperties';
import {
  IStepsRunner,
  StepsRunnerInjectionToken,
} from '../../helpers/steps/iStepsRunner';

/**
 * Properties for {@link RunStepsAction}
 */
export class RunStepsActionProperties extends ActionWithStepsProperties {}

/** Runner type aliases for {@link RunStepsAction} */
export const RunStepsActionTypeAliases = ['run', 'run-steps'] as const;

/**
 * Runs specified test steps
 * @properties {@link RunStepsActionProperties}
 * @runnerType {@link RunStepsActionTypeAliases}
 */
@Action(
  RunStepsActionProperties,
  ...RunStepsActionTypeAliases,
)
export class RunStepsAction extends IAction<RunStepsActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: RunStepsActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<RunStepsAction>(
      RunStepsAction,
    );
  }

  public async run(state: State): Promise<void> {
    if (!this.props.steps) {
      throw new PropertyIsRequiredException('steps');
    }

    if (!Array.isArray(this.props.steps)) {
      throw new InvalidOperationException(`Steps is not an array`);
    }

    this.logger.info(`Running ${this.props.steps.length} steps`);

    const basicStepNumber = getCurrentStepNumber(state.variables);

    await container
      .resolve<IStepsRunner>(StepsRunnerInjectionToken)
      .runTestSteps(
        this.props.steps,
        state,
        (stepNumber) => `${basicStepNumber}.${stepNumber++}`,
      );

    this.logger.info(`Successfully run all steps for all items`);
  }
}
