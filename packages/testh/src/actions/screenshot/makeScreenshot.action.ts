import {
  Action,
  getCurrentStepNumber,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  Selector,
  TestStep,
  UnknownOptionException,
} from '@testh/sdk';
import { Type } from 'class-transformer';
import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';

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
export class MakeScreenshotActionProperties implements IActionProperties {
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
@Action(MakeScreenshotActionProperties, ...MakeScreenshotActionTypeAliases)
export class MakeScreenshotAction extends IAction<MakeScreenshotActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: MakeScreenshotActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<MakeScreenshotAction>(MakeScreenshotAction);
  }

  public async run(state: IState, step: TestStep): Promise<void> {
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
        }-${getCurrentStepNumber(state.variables)}-${step.name}.png`;

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
