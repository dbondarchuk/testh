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
 * Properties for {@link UnionArraysAction}
 */
export class UnionArraysActionProperties implements IActionProperties {
  /**
   * First array
   * @defaultValue `[]` Empty array
   */
  first?: any[];

  /**
   * Second array (values to add to first array)
   */
  @BindingProperty()
  second: any[];
}

/**
 * Action type aliases for {@link UnionArraysAction}
 */
export const UnionArraysActionTypeAliases = ['union', 'add-to-array'] as const;

/**
 * Creates a union of two arrays.
 * Is useful to create a new array with values
 * @properties {@link UnionArraysActionProperties}
 * @runnerType {@link UnionArraysActionTypeAliases}
 * @result `Array<any>` Array
 */
@Action(
  UnionArraysActionProperties,
  'Union arrays',
  ...UnionArraysActionTypeAliases,
)
export class UnionArraysAction extends IAction<
  UnionArraysActionProperties,
  any[]
> {
  private readonly logger: ILogger;
  constructor(
    props: UnionArraysActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<UnionArraysAction>(UnionArraysAction);
  }

  public async run(_: IState): Promise<any[]> {
    const array = this.props.first || [];
    const result = [...array, ...this.props.second];

    this.logger.info(`Succesfully added a new values into the array`);

    return result;
  }
}
