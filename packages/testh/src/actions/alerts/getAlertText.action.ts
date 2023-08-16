import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GetAlertTextAlertAction}
 */
export class GetAlertTextAlertActionProperties implements IActionProperties {}

/** Action type aliases for {@link GetAlertTextAlertAction} */
export const GetAlertTextAlertActionTypeAliases = ['alert-get-text'] as const;

/**
 * Gets alert text
 * @properties {@link GetAlertTextAlertActionProperties}
 * @runnerType {@link GetAlertTextAlertActionTypeAliases}
 * @result `string` Alert text
 */
@Action(
  GetAlertTextAlertActionProperties,
  'Get alert text',
  ...GetAlertTextAlertActionTypeAliases,
)
export class GetAlertTextAlertAction extends IAction<
  GetAlertTextAlertActionProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(
    props: GetAlertTextAlertActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetAlertTextAlertAction>(
      GetAlertTextAlertAction,
    );
  }

  public async run(state: IState): Promise<string> {
    this.logger.info('Getting alert text');

    const alert = await state.currentDriver.switchTo().alert();
    const text = await alert.getText();

    this.logger.info(`Successfully got alert text: '${text}'`);
    return text;
  }
}
