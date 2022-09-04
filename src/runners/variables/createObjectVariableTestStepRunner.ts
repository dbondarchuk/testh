import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
} from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from "../../models/runners/ITestStepRunnerProperties";
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

/**
 * Properties for {@link CreateObjectVariableTestStepRunner}
 */
export class CreateObjectVariableTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Object properties
   */
  properties: Record<string, any>;
}

/**
 * Runner type aliases for {@link CreateObjectVariableTestStepRunner}
 */
export const CreateObjectVariableTestStepRunnerTypeAliases = ['create-object', 'new-object'] as const;

/**
 * Creates an object and returns it
 * @properties {@link CreateObjectVariableTestStepRunnerProperties}
 * @runnerType {@link CreateObjectVariableTestStepRunnerTypeAliases}
 */
@Register(CreateObjectVariableTestStepRunnerProperties, ...CreateObjectVariableTestStepRunnerTypeAliases)
export class CreateObjectVariableTestStepRunner extends ITestStepRunner<CreateObjectVariableTestStepRunnerProperties, Record<string, any>> {
  private readonly logger: ILogger;
  constructor(
    props: CreateObjectVariableTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CreateObjectVariableTestStepRunner>(
      CreateObjectVariableTestStepRunner,
    );
  }

  public async run(_: TestRunState): Promise<Record<string, any>> {
    const obj = {};

    for (const key in this.props.properties) {
      obj[key] = this.props.properties[key];
    }

    this.logger.info(
      `Successfully created object '${JSON.stringify(obj)}'`
    );

    return obj;
  }
}
