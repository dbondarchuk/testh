import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
} from '@testh/sdk';

/**
 * Properties for {@link GetPropertyFromObjectAction}
 */
export class GetPropertyFromObjectActionProperties
  implements IActionProperties
{
  /**
   * Array to get element from
   */
  array: any[];

  /**
   * Zero-based index of the element
   * Can be negative. `-1` means last element in the array
   */
  index: number;
}

/**
 * Action type aliases for {@link GetPropertyFromObjectAction}
 */
export const GetPropertyFromObjectActionTypeAliases = [
  'get-array-element',
  'array-element'
] as const;

/**
 * Gets element from the array by index
 * @properties {@link GetPropertyFromObjectActionProperties}
 * @runnerType {@link GetPropertyFromObjectActionTypeAliases}
 * @returns {any} Element value
 */
@Action(
  GetPropertyFromObjectActionProperties,
  'Get array element',
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
    const index = this.props.index >= 0 ? this.props.index : this.props.array.length + this.props.index;

    const value = this.props.array[index];

    this.logger.info(
      `Successfully got array element`,
    );

    return value;
  }
}
