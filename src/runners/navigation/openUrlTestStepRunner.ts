import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
  ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { LoggerFactory } from '../../logger/loggerFactory';

export class OpenUrlTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  url: string;
}

/**
 * Navigates to a given url
 */
@Register(OpenUrlTestStepRunnerProperties, 'open-url')
export class OpenUrlTestStepRunner extends ITestStepRunner<OpenUrlTestStepRunnerProperties> {
  private readonly logger: ILogger;

  constructor(
    props: OpenUrlTestStepRunnerProperties,
    loggerFactory: LoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<OpenUrlTestStepRunner>(
      OpenUrlTestStepRunner,
    );
  }

  public async run(state: TestRunState): Promise<void> {
    const driver = state.currentDriver;

    this.logger.info(`Opening url '${this.props.url}'.`);
    await driver.get(this.props.url);

    this.logger.info(`Url '${this.props.url} was succesfully opened.`);
  }
}
