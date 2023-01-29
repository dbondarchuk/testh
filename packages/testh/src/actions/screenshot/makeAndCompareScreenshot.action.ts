import {
  Action,
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
import * as looksSame from 'looks-same';
import { MakeScreenshotAction, ScreenshotType } from './makeScreenshot.action';

/**
 * Properties for {@link MakeAndCompareScreenshotAction}
 */
export class MakeAndCompareScreenshotActionProperties
  implements IActionProperties
{
  /**
   * Screenshot type
   * @defaultValue `visible-page`
   */
  type?: ScreenshotType;

  /**
   * Path to the refernce image
   * @defaultValue `undefined` If path is not provided, this action will just make a new screenshot
   */
  reference?: string;

  /**
   * ΔE value that will be treated as error.
   * Setting tolerance to 0 will produce a strict mode of comparing images
   * @defaultValue `2`
   */
  tolerance?: number;

  /**
   * Element select if type is 'element'
   */
  @Type(() => SelectorOrElement)
  selector?: SelectorOrElement;
}

/** Action type aliases for {@link MakeAndCompareScreenshotAction} */
export const MakeAndCompareScreenshotActionTypeAliases = [
  'compare-screenshot',
] as const;

/**
 * Makes a screenshot and compares it to existing image
 * @properties {@link MakeAndCompareScreenshotActionProperties}
 * @runnerType {@link MakeAndCompareScreenshotActionTypeAliases}
 * @returns {boolean} Whether the comparison was successful or no reference image were provided
 */
@Action(
  MakeAndCompareScreenshotActionProperties,
  'Make And Compare Screenshot',
  ...MakeAndCompareScreenshotActionTypeAliases,
)
export class MakeAndCompareScreenshotAction extends IAction<
  MakeAndCompareScreenshotActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: MakeAndCompareScreenshotActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<MakeAndCompareScreenshotAction>(
      MakeAndCompareScreenshotAction,
    );
  }

  public async run(state: IState, step: TestStep): Promise<boolean> {
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

    if (!this.props.reference) {
      this.logger.info('No reference image were provided.');
      return true;
    }

    const tolerance = this.props.tolerance ?? 2;
    this.logger.info(
      `Comparing screenshot to the existing image '${this.props.reference}' with tolerance = ${tolerance}`,
    );

    const current = Buffer.from(screenshot, 'base64');

    const result = await looksSame(current, this.props.reference, {
      tolerance: tolerance,
    });

    this.logger.info(
      `Comparison was${
        result.equal ? ' not' : ''
      } successful. Building the diff image.`,
    );

    const resultBuffer: Buffer = await looksSame.createDiff({
      current: current,
      reference: this.props.reference,
      highlightColor: 'rgba(157, 48, 207, 0.3)',
      tolerance: tolerance,
      // @ts-expect-error looks-same has this option to set type of the image
      extension: 'png',
    });

    await saver.save(
      resultBuffer.toString('base64'),
      step,
      state,
      `Diff of the screenshot for the step '${step.name}' of the test '${state.test.name}' and reference image '${this.props.reference}'`,
      'diff',
    );

    return result.equal;
  }
}
