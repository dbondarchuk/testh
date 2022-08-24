import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

export class SetVariableTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  variable: string;
  value: any;
}

/**
 * Sets a value into a variable
 */
@Register(SetVariableTestStepRunnerProperties, 'set-variable')
export class SetVariableTestStepRunner extends ITestStepRunner<SetVariableTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SetVariableTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SetVariableTestStepRunner>(
      SetVariableTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    let variable = this.props.variable;
    if (!variable) {
      throw new PropertyIsRequiredException('variable');
    }

    variable = state.variables.put(variable, this.props.value);
    this.logger.info(`Succesfully stored value into ${variable} variable`);
  }
}
