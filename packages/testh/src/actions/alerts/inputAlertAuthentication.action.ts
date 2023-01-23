import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link InputAlertAuthenticationAction}
 */
export class InputAlertAuthenticationActionProperties
  implements IActionProperties
{
  /** Username to put into the authentication prompt message box */
  username?: string;

  /** Password to put into the authentication prompt message box */
  password?: string;
}

/** Action type aliases for {@link InputAlertAuthenticationAction} */
export const InputAlertAuthenticationActionTypeAliases = [
  'alert-authenticate',
] as const;

/**
 * Sets the username and password in an alert prompting for credentials (such as a Basic HTTP Auth prompt) and accepts the alert
 * @properties {@link InputAlertAuthenticationActionProperties}
 * @runnerType {@link InputAlertAuthenticationActionTypeAliases}
 */
@Action(
  InputAlertAuthenticationActionProperties,
  'Fill alert authentication',
  ...InputAlertAuthenticationActionTypeAliases,
)
export class InputAlertAuthenticationAction extends IAction<
  InputAlertAuthenticationActionProperties,
  void
> {
  private readonly logger: ILogger;
  constructor(
    props: InputAlertAuthenticationActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<InputAlertAuthenticationAction>(
      InputAlertAuthenticationAction,
    );
  }

  public async run(state: IState): Promise<void> {
    this.logger.info('Authenticating using alert');

    const alert = await state.currentDriver.switchTo().alert();
    await alert.authenticateAs(
      this.props.username || '',
      this.props.password || '',
    );

    this.logger.info('Successfully set authentication via alert');
  }
}
