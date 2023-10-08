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
 * Properties for {@link DeleteCookieAction}
 */
export class DeleteCookieActionProperties implements IActionProperties {
  /** Name of the cookie */
  @BindingProperty()
  name: string;
}

/** Action type aliases for {@link DeleteCookieAction} */
export const DeleteCookieActionTypeAliases = ['delete-cookie'] as const;

/**
 * Deletes a cookies visible to the current page by its name
 * @properties {@link DeleteCookieActionProperties}
 * @runnerType {@link DeleteCookieActionTypeAliases}
 */
@Action(
  DeleteCookieActionProperties,
  'Delete a cookie',
  ...DeleteCookieActionTypeAliases,
)
export class DeleteCookieAction extends IAction<DeleteCookieActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: DeleteCookieActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<DeleteCookieAction>(DeleteCookieAction);
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.name) {
      throw new PropertyIsRequiredException('name');
    }

    await state.currentDriver.manage().deleteCookie(this.props.name);

    this.logger.info(
      `Successfully deleted a cookie with the name '${this.props.name}'`,
    );
  }
}
