import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

export class AddToArrayVariableTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  variable: string;
  value: any;
}

/**
 * Sets a value into a variable
 */
@Register(AddToArrayVariableTestStepRunnerProperties, 'add-to-array-variable')
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
