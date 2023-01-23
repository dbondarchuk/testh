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
 * Properties for {@link AddToArrayAction}
 */
export class AddToArrayActionProperties implements IActionProperties {
  /**
   * Existing array
   * @default {[]} Empty array
   */
  array?: any[];

  /**
   * Values to add
   */
  @BindingProperty()
  values: any[];
}

/**
 * Action type aliases for {@link AddToArrayAction}
 */
export const AddToArrayActionTypeAliases = ['add-to-array'] as const;

/**
 * Adds new values into the array or creates a new array
 * @properties {@link AddToArrayActionProperties}
 * @runnerType {@link AddToArrayActionTypeAliases}
 * @returns {Array<any>} Array
 */
@Action(
  AddToArrayActionProperties,
  'Add items to the array',
  ...AddToArrayActionTypeAliases,
)
export class AddToArrayAction extends IAction<
  AddToArrayActionProperties,
  any[]
> {
  private readonly logger: ILogger;
  constructor(
    props: AddToArrayActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<AddToArrayAction>(AddToArrayAction);
  }

  public async run(_: IState): Promise<any[]> {
    const array = this.props.array || [];
    for (const item of this.props.values) {
      array.push(item);
    }

    this.logger.info(`Succesfully added a new values into the array`);

    return array;
  }
}
