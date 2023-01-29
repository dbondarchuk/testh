import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  TestStep,
} from '@testh/sdk';

/**
 * Properties for {@link OpenNewWindowAction}
 */
export class OpenNewWindowActionProperties implements IActionProperties {
  /**
   * Type of the window to open
   * @defaultValue Value will be based on the type of the action that's used
   */
  @BindingProperty()
  type?: 'window' | 'tab';
}

/** Type which will determine to open as a window */
export const OpenNewWindowActionTypeWindow = 'open-window';

/** Type which will determine to open as a tab */
export const OpenNewWindowActionTypeTab = 'open-tab';

/** Action type aliases for {@link OpenNewWindowAction} */
export const OpenNewWindowActionTypeAliases = [OpenNewWindowActionTypeWindow, OpenNewWindowActionTypeTab] as const;

/**
 * Opens a new window or tab and switches to it
 * @properties {@link OpenNewWindowActionProperties}
 * @runnerType {@link OpenNewWindowActionTypeAliases}
 */
@Action(
  OpenNewWindowActionProperties,
  'Switch to frame',
  ...OpenNewWindowActionTypeAliases,
)
export class OpenNewWindowAction extends IAction<OpenNewWindowActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: OpenNewWindowActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<OpenNewWindowAction>(OpenNewWindowAction);
  }

  public async run(state: IState, step: TestStep): Promise<void> {
    let type = this.props.type;
    if (type) {
      switch (step.type) {
        case OpenNewWindowActionTypeWindow:
          type = 'window';
          break;

        case OpenNewWindowActionTypeTab:
        default:
          type = 'tab';
          break;
      }
    }

    await state.currentDriver.switchTo().newWindow(type);

    this.logger.info(`Successfully opened a new ${type} and switched to it`);
  }
}
