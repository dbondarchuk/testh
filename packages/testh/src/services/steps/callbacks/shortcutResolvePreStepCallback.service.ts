import {
  ActionContainerInjectionToken,
  IActionContainer,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  IPreStepExecutionCallback,
  IState,
  LoggerFactoryInjectionToken,
  PreStepExecutionCallbackInjectionToken,
  Service,
  stepsWrapper,
  TestStep,
  toTestStepsAction,
} from '@testh/sdk';
import { inject } from 'tsyringe';

import 'reflect-metadata';

const RunStepsSingleResultActionTypeAlias = 'run-steps-single-result';

@Service(PreStepExecutionCallbackInjectionToken)
export class ShortcutResolvePreStepCallback
  implements IPreStepExecutionCallback
{
  private readonly logger: ILogger;

  constructor(
    @inject(ActionContainerInjectionToken)
    private readonly actionContainer: IActionContainer,
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.get<ShortcutResolvePreStepCallback>(
      ShortcutResolvePreStepCallback,
    );
  }

  async execute(step: TestStep, state: IState): Promise<TestStep> {
    const shortcuts = state.test.shortcuts;
    const shortcut = shortcuts?.find(
      (s) => s.type.toLowerCase() === step.type.toLowerCase(),
    );
    if (!shortcut) return step;

    this.logger.info(
      `Found a shortcut for '${shortcut.type}' with ${shortcut.steps.length} steps`,
    );

    const actions = this.actionContainer.get();
    const action = actions[shortcut.type];

    if (action) {
      throw new InvalidOperationException(
        `Can't execute a shortcut of type '${shortcut.type}'. Action with the same type already exists`,
      );
    }

    const newStep: TestStep = {
      name: step.name || shortcut.name,
      condition: step.condition,
      disabled: step.disabled,
      ignoreError: step.ignoreError,
      runOnFailure: step.runOnFailure,
      type: RunStepsSingleResultActionTypeAlias,
      values: {
        steps: toTestStepsAction(
          stepsWrapper(shortcut.steps, {
            VALUES: step.values,
          }),
        ),
      },
    };

    return newStep;
  }
}
