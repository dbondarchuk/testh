import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

/**
 * Properties for {@link CreateObjectVariableAction}
 */
export class CreateObjectVariableActionProperties
  implements IActionProperties
{
  /**
   * Object properties
   */
  properties: Record<string, any>;
}

/**
 * Runner type aliases for {@link CreateObjectVariableAction}
 */
export const CreateObjectVariableActionTypeAliases = [
  'create-object',
  'new-object',
] as const;

/**
 * Creates an object and returns it
 * @properties {@link CreateObjectVariableActionProperties}
 * @runnerType {@link CreateObjectVariableActionTypeAliases}
 */
@Register(
  CreateObjectVariableActionProperties,
  ...CreateObjectVariableActionTypeAliases,
)
export class CreateObjectVariableAction extends IAction<
  CreateObjectVariableActionProperties,
  Record<string, any>
> {
  private readonly logger: ILogger;
  constructor(
    props: CreateObjectVariableActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CreateObjectVariableAction>(
      CreateObjectVariableAction,
    );
  }

  public async run(_: State): Promise<Record<string, any>> {
    const obj = {};

    for (const key in this.props.properties) {
      obj[key] = this.props.properties[key];
    }

    this.logger.info(`Successfully created object '${JSON.stringify(obj)}'`);

    return obj;
  }
}
