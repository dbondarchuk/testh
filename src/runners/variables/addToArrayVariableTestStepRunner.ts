import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
} from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from "../../models/runners/ITestStepRunnerProperties";
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

/**
 * Properties for {@link AddToArrayVariableTestStepRunner}
 */
export class AddToArrayVariableTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Name of the array variable 
   */
  variable: string;

  /**
   * Value to add
   */
  value: any;
}

/**
 * Runner type aliases for {@link AddToArrayVariableTestStepRunner}
 */
export const AddToArrayVariableTestStepRunnerTypeAliases = ['add-to-array-variable'] as const;

/**
 * Sets a value into a variable
 * @properties {@link AddToArrayVariableTestStepRunnerProperties}
 * @runnerType {@link AddToArrayVariableTestStepRunnerTypeAliases}
 */
@Register(AddToArrayVariableTestStepRunnerProperties, ...AddToArrayVariableTestStepRunnerTypeAliases)
export class AddToArrayVariableTestStepRunner extends ITestStepRunner<AddToArrayVariableTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: AddToArrayVariableTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<AddToArrayVariableTestStepRunner>(
      AddToArrayVariableTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    const array = state.variables.get(variable) as Array<any>;
    array.push(this.props.value);

    this.logger.info(
      `Succesfully added a new value into ${variable} array variable`,
    );
  }
}
