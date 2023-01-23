import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link AddPropertiesToObjectAction}
 */
export class AddPropertiesToObjectActionProperties
  implements IActionProperties
{
  /**
   * Existing object
   * @default {{}} Empty object
   */
  object: Record<string, any>;

  /**
   * Object properties
   */
  @BindingProperty()
  properties: Record<string, any>;
}

/**
 * Action type aliases for {@link AddPropertiesToObjectAction}
 */
export const AddPropertiesToObjectActionTypeAliases = [
  'add-properties',
  'create-object',
  'new-object',
] as const;

/**
 * Adds properties to the existing object or creates a new one
 * @properties {@link AddPropertiesToObjectActionProperties}
 * @runnerType {@link AddPropertiesToObjectActionTypeAliases}
 * @returns {Record<string, any>} Object
 */
@Action(
  AddPropertiesToObjectActionProperties,
  'Add properties to the object',
  ...AddPropertiesToObjectActionTypeAliases,
)
export class AddPropertiesToObjectAction extends IAction<
  AddPropertiesToObjectActionProperties,
  Record<string, any>
> {
  private readonly logger: ILogger;
  constructor(
    props: AddPropertiesToObjectActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<AddPropertiesToObjectAction>(
      AddPropertiesToObjectAction,
    );
  }

  public async run(_: IState): Promise<Record<string, any>> {
    const obj = this.props.object || {};

    for (const key in this.props.properties) {
      obj[key] = this.props.properties[key];
    }

    this.logger.info(
      `Successfully add properties object '${JSON.stringify(obj)}'`,
    );

    return obj;
  }
}
