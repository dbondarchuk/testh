import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';
import { error } from 'selenium-webdriver';

/**
 * Properties for {@link IsAlertPresentedAction}
 */
export class IsAlertPresentedActionProperties implements IActionProperties {}

/** Action type aliases for {@link IsAlertPresentedAction} */
export const IsAlertPresentedActionTypeAliases = ['is-alert-present'] as const;

/**
 * Checks if the alert is presented
 * @properties {@link IsAlertPresentedActionProperties}
 * @runnerType {@link IsAlertPresentedActionTypeAliases}
 * @result `boolean` Whether the alert is present
 */
@Action(
  IsAlertPresentedActionProperties,
  'Get whether alert is present',
  ...IsAlertPresentedActionTypeAliases,
)
export class IsAlertPresentedAction extends IAction<
  IsAlertPresentedActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: IsAlertPresentedActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<IsAlertPresentedAction>(
      IsAlertPresentedAction,
    );
  }

  public async run(state: IState): Promise<boolean> {
    this.logger.info('Checking if alert is presented');

    try {
      await state.currentDriver.switchTo().alert();
      this.logger.info('Alert is presented');

      return true;
    } catch (e) {
      if (e instanceof error.NoSuchAlertError) {
        this.logger.info('Alert is not presented');

        return false;
      }

      throw e;
    }
  }
}
