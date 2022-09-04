import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
} from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from "../../models/runners/ITestStepRunnerProperties";
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';

/**
 * Properties for {@link OpenUrlTestStepRunner}
 */
export class OpenUrlTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Url to open
   */
  url: string;
}

/** Runner types for {@link OpenUrlTestStepRunner} */
export const OpenUrlTestStepRunnerTypeAliases = ['open-url'] as const;

/**
 * Navigates to a given url
 * @properties {@link OpenUrlTestStepRunnerProperties}
 * @runnerType {@link OpenUrlTestStepRunnerTypeAliases}
 */
@Register(OpenUrlTestStepRunnerProperties, ...OpenUrlTestStepRunnerTypeAliases)
export class OpenUrlTestStepRunner extends ITestStepRunner<OpenUrlTestStepRunnerProperties> {
  private readonly logger: ILogger;

  constructor(
    props: OpenUrlTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
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

    this.logger.info(`Url '${this.props.url} was successfully opened.`);
  }
}
