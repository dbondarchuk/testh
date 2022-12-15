import { Action, IAction, IActionProperties, ILogger, ILoggerFactory, IState } from '@testh/sdk';

/**
 * Properties for {@link OpenUrlAction}
 */
export class OpenUrlActionProperties
  implements IActionProperties
{
  /**
   * Url to open
   */
  url: string;
}

/** Runner types for {@link OpenUrlAction} */
export const OpenUrlActionTypeAliases = ['open-url'] as const;

/**
 * Navigates to a given url
 * @properties {@link OpenUrlActionProperties}
 * @runnerType {@link OpenUrlActionTypeAliases}
 */
@Action(OpenUrlActionProperties, ...OpenUrlActionTypeAliases)
export class OpenUrlAction extends IAction<OpenUrlActionProperties> {
  private readonly logger: ILogger;

  constructor(
    props: OpenUrlActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<OpenUrlAction>(
      OpenUrlAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const driver = state.currentDriver;

    this.logger.info(`Opening url '${this.props.url}'.`);
    await driver.get(this.props.url);

    this.logger.info(`Url '${this.props.url} was successfully opened.`);
  }
}
