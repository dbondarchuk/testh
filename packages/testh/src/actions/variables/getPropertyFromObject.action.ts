import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
} from '@testh/sdk';

/**
 * Properties for {@link GetPropertyFromObjectAction}
 */
export class GetPropertyFromObjectActionProperties
  implements IActionProperties
{
  /**
   * Object to get property from
   */
  object: Record<string, any>;

  /**
   * Object property
   */
  property: string;
}

/**
 * Action type aliases for {@link GetPropertyFromObjectAction}
 */
export const GetPropertyFromObjectActionTypeAliases = [
  'get-property',
  'get'
] as const;

/**
 * Gets property from object by name
 * @properties {@link GetPropertyFromObjectActionProperties}
 * @runnerType {@link GetPropertyFromObjectActionTypeAliases}
 * @returns {any} Property value
 */
@Action(
  GetPropertyFromObjectActionProperties,
  'Get property',
  ...GetPropertyFromObjectActionTypeAliases,
)
export class GetPropertyFromObjectAction extends IAction<
  GetPropertyFromObjectActionProperties,
  any
> {
  private readonly logger: ILogger;
  constructor(
    props: GetPropertyFromObjectActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetPropertyFromObjectAction>(
      GetPropertyFromObjectAction,
    );
  }

  public async run(_: IState): Promise<any> {
    if (!this.props.property) {
      throw new PropertyIsRequiredException('property');
    }

    const value = this.props.object[this.props.property];

    this.logger.info(
      `Successfully got property value`,
    );

    return value;
  }
}
