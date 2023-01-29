import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link SwitchToDefaultContentAction}
 */
export class SwitchToDefaultContentActionProperties implements IActionProperties {
}

/** Action type aliases for {@link SwitchToDefaultContentAction} */
export const SwitchToDefaultContentActionTypeAliases = ['switch-to-default', 'default-frame'] as const;

/**
 * Switches to the first frame on the page
 * @properties {@link SwitchToDefaultContentActionProperties}
 * @runnerType {@link SwitchToDefaultContentActionTypeAliases}
 */
@Action(
  SwitchToDefaultContentActionProperties,
  'Switch to default content',
  ...SwitchToDefaultContentActionTypeAliases,
)
export class SwitchToDefaultContentAction extends IAction<SwitchToDefaultContentActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToDefaultContentActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToDefaultContentAction>(SwitchToDefaultContentAction);
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.switchTo().defaultContent();

    this.logger.info(`Successfully changed focus to the default frame`);
  }
}
