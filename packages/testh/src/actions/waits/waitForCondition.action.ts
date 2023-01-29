import {
  Action,
  BindingProperty,
  Condition,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  ToCondition,
  ToNumber,
} from '@testh/sdk';
import { performance } from 'perf_hooks';

const MILLISECONDS_IN_SECOND = 1000;

/**
 * Properties for {@link WaitForConditionAction}
 */
export class WaitForConditionActionProperties implements IActionProperties {
  /**
   * Condition to wait for
   */
  @BindingProperty()
  @ToCondition()
  condition: Condition;

  /**
   * Wait timeout in seconds
   * @defaultValue `5`
   */
  @ToNumber()
  timeout?: number;

  /**
   * Check interval in milliseconds
   * @defaultValue `100`
   */
  @ToNumber()
  interval?: number;
}

/** Action type aliases for {@link WaitForConditionActionTypeAliases} */
export const WaitForConditionActionTypeAliases = ['wait'] as const;

/**
 * Waits for a specific condition
 * @parameters {@link WaitForConditionActionProperties}
 * @runnerType {@link WaitForConditionActionTypeAliases}
 */
@Action(
  WaitForConditionActionProperties,
  'Wait for the condition to become true',
  ...WaitForConditionActionTypeAliases,
)
export class WaitForConditionAction extends IAction<WaitForConditionActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: WaitForConditionActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<WaitForConditionAction>(
      WaitForConditionAction,
    );
  }

  public run(state: IState): Promise<void> {
    const timeout = this.props.timeout ?? 5;
    const interval = this.props.interval ?? 100;
    if (this.props.condition === undefined || this.props.condition === null) {
      throw new PropertyIsRequiredException('condition');
    }

    this.logger.info(
      `Waiting for for the condition for ${timeout} seconds with ${interval}ms interval.`,
    );

    const starTime = performance.now();
    const wait = async (
      resolve: () => void,
      reject: (reason?: any) => void,
    ): Promise<void> => {
      if (performance.now() - starTime > timeout * MILLISECONDS_IN_SECOND) {
        reject(new Error('TimeoutException'));
        return;
      }

      this.logger.debug('Checking a condition');

      const result = await this.props.condition(state);
      if (result) {
        this.logger.info('Condition was resolved succesfuly');
        resolve();
        return;
      }

      this.logger.debug(
        `Condition hasn't been resolved yet. Waiting for ${interval}ms.`,
      );

      setTimeout(async () => await wait(resolve, reject));
    };

    const result = new Promise<void>((resolve, reject) => {
      setTimeout(async () => await wait(resolve, reject));
    });

    return result;
  }
}
