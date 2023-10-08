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
 * Properties for {@link MergeObjectsAction}
 */
export class MergeObjectsActionProperties implements IActionProperties {
  /**
   * Existing object
   * @defaultValue {{}} Empty object
   */
  object: Record<string, any>;

  /**
   * Second object
   */
  @BindingProperty()
  second: Record<string, any>;
}

/**
 * Action type aliases for {@link MergeObjectsAction}
 */
export const MergeObjectsActionTypeAliases = [
  'merge',
  'merge-objects',
  'add-properties',
  'create-object',
  'new-object',
] as const;

/**
 * Merges two objects.
 * Is usefult to add properties to the existing object or to create a new one
 * @properties {@link MergeObjectsActionProperties}
 * @runnerType {@link MergeObjectsActionTypeAliases}
 * @result `Record<string, any>` Object
 */
@Action(
  MergeObjectsActionProperties,
  'Merge objects',
  ...MergeObjectsActionTypeAliases,
)
export class MergeObjectsAction extends IAction<
  MergeObjectsActionProperties,
  Record<string, any>
> {
  private readonly logger: ILogger;
  constructor(
    props: MergeObjectsActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<MergeObjectsAction>(MergeObjectsAction);
  }

  public async run(_: IState): Promise<Record<string, any>> {
    const obj = this.props.object || {};

    const result = { ...obj, ...this.props.second };

    this.logger.info('Successfully merged two objects');

    return result;
  }
}
