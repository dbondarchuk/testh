import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IScreenshotSaver,
  IState,
  PropertyIsRequiredException,
  resolve,
  ScreenshotSaverInjectionToken,
  SelectorOrElement,
  TestStep,
  UnknownOptionException,
} from '@testh/sdk';
import { Type } from 'class-transformer';
import joinImages from 'join-images';
import { WebDriver } from 'selenium-webdriver';

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
   * @defaultValue visible-page
   */
  @BindingProperty()
  type?: ScreenshotType;

  /**
   * Element select if type is 'element'
   */
  @Type(() => SelectorOrElement)
  selector?: SelectorOrElement;
}

/** Action type aliases for {@link MakeScreenshotAction} */
export const MakeScreenshotActionTypeAliases = ['screenshot'] as const;

/**
 * Makes a screenshot
 * @properties {@link MakeScreenshotActionProperties}
 * @runnerType {@link MakeScreenshotActionTypeAliases}
 */
@Action(
  MakeScreenshotActionProperties,
  'Make Screenshot',
  ...MakeScreenshotActionTypeAliases,
)
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
    const type = this.props.type || 'page';

    let screenshot: string;

    switch (type) {
      case 'element': {
        if (!this.props.selector) {
          throw new PropertyIsRequiredException('selector');
        }

        this.logger.info(
          `Making a screenshot of the element ${this.props.selector}`,
        );

        const element = await this.props.selector.getElement(
          state.currentDriver,
        );
        screenshot = await element.takeScreenshot();

        break;
      }

      case 'all-page': {
        this.logger.info('Making a screenshot of all page');

        screenshot = await MakeScreenshotAction.makeAllPageScreenshot(
          state.currentDriver,
        );
        break;
      }

      case 'page':
      case 'visible-page': {
        this.logger.info('Making a screenshot of the visible page');

        screenshot = await driver.takeScreenshot();
        break;
      }

      default:
        throw new UnknownOptionException(`Unknown type - ${this.props.type}`);
    }

    const saver = resolve<IScreenshotSaver>(ScreenshotSaverInjectionToken);
    await saver.save(
      screenshot,
      step,
      state,
      `Screenshot for the step '${step.name}' of the test '${state.test.name}'`,
    );

    this.logger.info(`Successfully made a screenshot and saved it.`);
  }

  public static async makeAllPageScreenshot(
    driver: WebDriver,
  ): Promise<string> {
    const currentScroll: number = await driver.executeScript(
      'return document.documentElement.scrollTop',
    );

    const totalHeight: number = await driver.executeScript(
      'return document.body.offsetHeight',
    );
    const windowHeight: number = await driver.executeScript(
      'return window.outerHeight',
    );

    await driver.executeScript(`window.scrollTo(0, 0)`);

    const screenshots: Buffer[] = [];

    for (let i = 0; i < Math.ceil(totalHeight / windowHeight); i++) {
      await driver.executeScript(`window.scrollTo(0, window.outerHeight*${i})`);

      const screenshot = await driver.takeScreenshot();
      const buffer = Buffer.from(screenshot, 'base64');
      screenshots.push(buffer);
    }

    const joined = await joinImages(screenshots, { direction: 'vertical' });
    const buffer = await joined.png().toBuffer();

    await driver.executeScript(`window.scrollTo(0, ${currentScroll})`);

    return buffer.toString('base64');
  }
}
