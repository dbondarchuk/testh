import {
  ActionContainerInjectionToken,
  IActionContainer,
  ILogger,
  ILoggerFactory,
  IPreStepExecutionCallback,
  LoggerFactoryInjectionToken,
  PreStepExecutionCallbackInjectionToken,
  Service,
  TestStep,
  UnknownOptionException,
} from '@testh/sdk';
import { inject } from 'tsyringe';

@Service(PreStepExecutionCallbackInjectionToken)
export class DefaultStepNameCallbackPreStepCallback
  implements IPreStepExecutionCallback
{
  private readonly logger: ILogger;

  constructor(
    @inject(ActionContainerInjectionToken)
    private readonly actionContainer: IActionContainer,
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.get<DefaultStepNameCallbackPreStepCallback>(
      DefaultStepNameCallbackPreStepCallback,
    );
  }

  async execute(step: TestStep): Promise<TestStep> {
    if (!step.type || step.name) {
      return step;
    }

    const runnerType = this.actionContainer.get()[step.type];
    if (!runnerType) {
      throw new UnknownOptionException(
        `Can't find an action for the type '${step.type}'.`,
      );
    }

    this.logger.debug(`Found the action for type '${step.type}'`);

    const name = runnerType.defaultStepName;
    this.logger.debug(
      `Setting the default name '${name}' for the action of type '${step.type}`,
    );

    step.name = name;

    return step;
  }
}
