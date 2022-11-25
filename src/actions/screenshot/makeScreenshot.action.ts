import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { State } from '../../models/actions/testRunState';
import { IAction } from '../../models/actions/iAction';
import { IActionProperties } from '../../models/actions/iActionProperties';
import { Register } from '../../models/actions/actionRegistry';
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
  | 'element'

  /** All page */
  | 'all-page'

  /** Currently visible page */
  | 'visible-page'

  /** Alias for {@link ScreenshotType."visible-page"} */
  | 'page';

/**
 * Properties for {@link MakeScreenshotAction}
 */
export class MakeScreenshotActionProperties
  implements IActionProperties
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

/** Runner type aliases for {@link MakeScreenshotAction} */
export const MakeScreenshotActionTypeAliases = ['screenshot'] as const;

/**
 * Makes a screenshot
 * @properties {@link MakeScreenshotActionProperties}
 * @runnerType {@link MakeScreenshotActionTypeAliases}
 */
@Register(
  MakeScreenshotActionProperties,
  ...MakeScreenshotActionTypeAliases,
)
export class MakeScreenshotAction extends IAction<MakeScreenshotActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: MakeScreenshotActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<MakeScreenshotAction>(
      MakeScreenshotAction,
    );
  }

  public async run(state: State, step: TestStep): Promise<void> {
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
        }-${state.variables.get(VariablesContainer.TASK_STEP_NUMBER)}-${
          step.name
        }.png`;

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
