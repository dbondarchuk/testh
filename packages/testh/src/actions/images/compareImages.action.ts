import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  Safe,
} from '@testh/sdk';
import * as looksSame from 'looks-same';

/**
 * Properties for {@link CompareImagesAction}
 */
export class CompareImagesActionProperties implements IActionProperties {
  /**
   * Image to compare
   */
  image: Safe<Blob>;

  /**
   * Reference image blob
   */
  reference: Safe<Blob>;

  /**
   * ΔE value that will be treated as error.
   * Setting tolerance to 0 will produce a strict mode of comparing images
   * @defaultValue `2`
   */
  tolerance?: number;
}

/** Action type aliases for {@link CompareImagesAction} */
export const CompareImagesActionTypeAliases = ['compare-images'] as const;

/**
 * Compares an image to the another one
 * @properties {@link CompareImagesActionProperties}
 * @runnerType {@link CompareImagesActionTypeAliases}
 * @result `boolean` Whether the comparison was successful
 */
@Action(
  CompareImagesActionProperties,
  'Compare Images',
  ...CompareImagesActionTypeAliases,
)
export class CompareImagesAction extends IAction<
  CompareImagesActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: CompareImagesActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareImagesAction>(CompareImagesAction);
  }

  public async run(): Promise<boolean> {
    this.logger.info('Comparing two images.');

    if (!this.props.reference) {
      this.logger.info('Reference image was not provided');
      return true;
    }

    const tolerance = this.props.tolerance ?? 2;
    this.logger.info(
      `Comparing image to the existing reference with tolerance = ${tolerance}`,
    );

    const current = Buffer.from(await this.props.image().arrayBuffer());
    const reference = Buffer.from(await this.props.reference().arrayBuffer());

    const result = await looksSame(current, reference, {
      tolerance: tolerance,
    });

    this.logger.info(
      `Comparison was${!result.equal ? ' not' : ''} successful.`,
    );

    return result.equal;
  }
}
