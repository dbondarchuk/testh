import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
} from '@testh/sdk';

/**
 * Properties for {@link InputAlertTextAlertAction}
 */
export class InputAlertTextAlertActionProperties implements IActionProperties {
  /** Text to put into the prompt message box */
  @BindingProperty()
  text: string;
}

/** Action type aliases for {@link InputAlertTextAlertAction} */
export const InputAlertTextAlertActionTypeAliases = [
  'alert-input-text',
] as const;

/**
 * Types text into the alert prompt
 * @properties {@link InputAlertTextAlertActionProperties}
 * @runnerType {@link InputAlertTextAlertActionTypeAliases}
 */
@Action(
  InputAlertTextAlertActionProperties,
  'Input alert text',
  ...InputAlertTextAlertActionTypeAliases,
)
export class InputAlertTextAlertAction extends IAction<
  InputAlertTextAlertActionProperties,
  void
> {
  private readonly logger: ILogger;
  constructor(
    props: InputAlertTextAlertActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<InputAlertTextAlertAction>(
      InputAlertTextAlertAction,
    );
  }

  public async run(state: IState): Promise<void> {
    this.logger.info('Typing text into alert promt');
    if (!this.props.text) {
      throw new PropertyIsRequiredException('name');
    }

    const alert = await state.currentDriver.switchTo().alert();
    await alert.sendKeys(this.props.text);

    this.logger.info('Successfully typed text into alert promt');
  }
}
