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
 * Properties for {@link GetArrayLengthAction}
 */
export class GetArrayLengthActionProperties implements IActionProperties {
  /**
   * Array to get it's length
   * @defaultValue `[]` Empty array
   */
  @BindingProperty()
  array: any[];
}

/**
 * Action type aliases for {@link GetArrayLengthAction}
 */
export const GetArrayLengthActionTypeAliases = [
  'get-array-length',
  'array-length',
] as const;

/**
 * Gets array length
 * @properties {@link GetArrayLengthActionProperties}
 * @runnerType {@link GetArrayLengthActionTypeAliases}
 * @returns {number} Array length
 */
@Action(
  GetArrayLengthActionProperties,
  'Get array length',
  ...GetArrayLengthActionTypeAliases,
)
export class GetArrayLengthAction extends IAction<
  GetArrayLengthActionProperties,
  number
> {
  private readonly logger: ILogger;
  constructor(
    props: GetArrayLengthActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetArrayLengthAction>(GetArrayLengthAction);
  }

  public async run(_: IState): Promise<number> {
    const value = this.props.array.length;

    this.logger.info(`Successfully got array length: ${value}`);

    return value;
  }
}
