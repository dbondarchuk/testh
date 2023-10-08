import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  TestStep,
  ToBoolean,
} from '@testh/sdk';

/**
 * Properties for {@link AcceptOrDismissAlertAction}
 */
export class AcceptOrDismissAlertActionProperties implements IActionProperties {
  /**
   * Should be alert accepted or dismissed
   * @defaultValue `false` Alert will be dismmissed
   */
  @ToBoolean()
  @BindingProperty()
  accept?: boolean;
}

/** Action type which will use the property {@link AcceptOrDismissAlertActionProperties.accept} to determine whether to accept or dismiss the alert */
export const AcceptOrDismissAlertActionType = 'alert-accept-dismiss';

/** Action type which will accept the alert */
export const AcceptAlertActionType = 'alert-accept';

/** Action type which will accept the alert */
export const DismissAlertActionType = 'alert-dismiss';

/** Action type aliases for {@link AcceptOrDismissAlertAction} */
export const AcceptOrDismissAlertActionTypeAliases = [
  AcceptAlertActionType,
  DismissAlertActionType,
  AcceptOrDismissAlertActionType,
] as const;

/**
 * Accepts or dismisses the alert
 * @properties {@link AcceptOrDismissAlertActionProperties}
 * @runnerType {@link AcceptOrDismissAlertActionTypeAliases}
 */
@Action(
  AcceptOrDismissAlertActionProperties,
  'Accept or Dissmiss Alert',
  ...AcceptOrDismissAlertActionTypeAliases,
)
export class AcceptOrDismissAlertAction extends IAction<AcceptOrDismissAlertActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: AcceptOrDismissAlertActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<AcceptOrDismissAlertAction>(
      AcceptOrDismissAlertAction,
    );
  }

  public async run(state: IState, step: TestStep): Promise<void> {
    let accept = false;
    switch (step.type) {
      case AcceptAlertActionType:
        accept = true;
        break;

      case AcceptOrDismissAlertActionType:
        accept = !!this.props.accept;
        break;

      case DismissAlertActionType:
      default:
        accept = false;
        break;
    }

    const alert = await state.currentDriver.switchTo().alert();

    if (accept) {
      this.logger.info('Accepting alert...');
      await alert.accept();
      this.logger.info(`Successfully accepted alert`);
    } else {
      this.logger.info('Dismissing alert...');
      await alert.dismiss();
      this.logger.info(`Successfully dismissed alert`);
    }
  }
}
