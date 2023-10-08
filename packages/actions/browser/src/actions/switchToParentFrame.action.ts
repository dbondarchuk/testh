import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link SwitchToParentFrameAction}
 */
export class SwitchToParentFrameActionProperties implements IActionProperties {}

/** Action type aliases for {@link SwitchToParentFrameAction} */
export const SwitchToParentFrameActionTypeAliases = [
  'switch-to-parent-frame',
  'parent-frame',
] as const;

/**
 * Switches to the parent frame of the currently selected frame
 * @properties {@link SwitchToParentFrameActionProperties}
 * @runnerType {@link SwitchToParentFrameActionTypeAliases}
 */
@Action(
  SwitchToParentFrameActionProperties,
  'Switch to parent frame',
  ...SwitchToParentFrameActionTypeAliases,
)
export class SwitchToParentFrameAction extends IAction<SwitchToParentFrameActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToParentFrameActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToParentFrameAction>(
      SwitchToParentFrameAction,
    );
  }

  public async run(state: IState): Promise<void> {
    await state.currentDriver.switchTo().parentFrame();

    this.logger.info(`Successfully changed focus to the parent frame`);
  }
}
