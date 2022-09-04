import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
  ITestStepRunner,
} from '../../models/runners/iTestStepRunner';
import { ITestStepRunnerProperties } from "../../models/runners/ITestStepRunnerProperties";
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { mkdir, writeFile } from 'fs/promises';
import { VariablesContainer } from '../../models/variables/variablesContainer';
import { dirname } from 'path';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';
import { TestStep } from '../../models/tests/testStep';
import { UnknownOptionException } from '../../models/exceptions/unknownOptionException';

/** Screenshot type */
export type ScreenshotType = 
  /** Specific element */
  'element' 

  /** All page */
  | 'all-page' 
  
  /** Currently visible page */
  | 'visible-page' 
  
  /** Alias for {@link ScreenshotType."visible-page"} */
  | 'page';

/**
 * Properties for {@link MakeScreenshotTestStepRunner}
 */
export class MakeScreenshotTestStepRunnerProperties
  implements ITestStepRunnerProperties
{
  /**
   * Screenshot type
   */
  type: ScreenshotType;

  /**
   * Element select if type is 'element'
   */
  @Type(() => Selector)
  selector?: Selector;
}

/** Runner type aliases for {@link MakeScreenshotTestStepRunner} */
export const MakeScreenshotTestStepRunnerTypeAliases = ['screenshot'] as const;

/**
 * Makes a screenshot
 * @properties {@link MakeScreenshotTestStepRunnerProperties}
 * @runnerType {@link MakeScreenshotTestStepRunnerTypeAliases}
 */
@Register(MakeScreenshotTestStepRunnerProperties, ...MakeScreenshotTestStepRunnerTypeAliases)
export class MakeScreenshotTestStepRunner extends ITestStepRunner<MakeScreenshotTestStepRunnerProperties> {
  private readonly logger: ILogger;
  constructor(
    props: MakeScreenshotTestStepRunnerProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<MakeScreenshotTestStepRunner>(
      MakeScreenshotTestStepRunner,
    );
  }

  public async run(state: TestRunState, step: TestStep): Promise<void> {
    const driver = state.currentDriver;

    switch (this.props.type) {
      case 'element':
        if (!this.props.selector) {
          throw new PropertyIsRequiredException('selector');
        }

        throw new UnknownOptionException('Unsupported type');

      case 'all-page':
        throw new UnknownOptionException('Unsupported type');

      case 'page':
      case 'visible-page': {
        this.logger.info('Making a screenshot of the visible page');
        const screenshotPath = `screenshots/${
          state.testName
        }-${state.variables.get(VariablesContainer.TASK_STEP_NUMBER)}-${step.name}.png`;

        const data = await driver.takeScreenshot();
        await this.writeScreenshot(data, screenshotPath);

        this.logger.info(
          `Successfully made a screenshot of the visible page and saved it to '${screenshotPath}'`,
        );
        break;
      }

      default:
        throw new UnknownOptionException(`Unknown type - ${this.props.type}`);
    }
  }

  private async writeScreenshot(
    data: string,
    pathToFile: string,
  ): Promise<void> {
    await mkdir(dirname(pathToFile), { recursive: true });
    await writeFile(
      pathToFile,
      data.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );
  }
}
