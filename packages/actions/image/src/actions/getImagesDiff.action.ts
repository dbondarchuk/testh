import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  Safe,
} from '@testh/sdk';
import * as looksSame from 'looks-same';

/**
 * Properties for {@link GetImagesDiffAction}
 */
export class GetImagesDiffActionProperties implements IActionProperties {
  /**
   * Image to compare
   */
  image: Safe<Blob>;

  /**
   * Reference image blob
   */
  reference: Safe<Blob>;

  /**
   * ΔE value that will be treated allow to treat images as same.
   * Setting tolerance to 0 will produce a strict mode of comparing images
   * @defaultValue `2`
   */
  tolerance?: number;
}

/** Action type aliases for {@link GetImagesDiffAction} */
export const GetImagesDiffActionTypeAliases = ['get-images-diff'] as const;

/**
 * Compares an image to the another one and creates a visual diff
 * @properties {@link GetImagesDiffActionProperties}
 * @runnerType {@link GetImagesDiffActionTypeAliases}
 * @result `Safe<Blob>` Visual diff image
 */
@Action(
  GetImagesDiffActionProperties,
  'Get Images Diff',
  ...GetImagesDiffActionTypeAliases,
)
export class GetImagesDiffAction extends IAction<
  GetImagesDiffActionProperties,
  Safe<Blob>
> {
  private readonly logger: ILogger;
  constructor(
    props: GetImagesDiffActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<GetImagesDiffAction>(GetImagesDiffAction);
  }

  public async run(): Promise<Safe<Blob>> {
    this.logger.info('Comparing two images.');

    if (!this.props.reference) {
      throw new InvalidOperationException('Reference image was not provided');
    }

    const tolerance = this.props.tolerance ?? 2;
    this.logger.info(
      `Comparing image to the existing reference with tolerance = ${tolerance}`,
    );

    const current = Buffer.from(await this.props.image().arrayBuffer());
    const reference = Buffer.from(await this.props.reference().arrayBuffer());

    this.logger.info('Building the diff image.');

    const resultBuffer: Buffer = await looksSame.createDiff({
      current: current,
      reference: reference,
      highlightColor: 'rgba(157, 48, 207, 0.3)',
      tolerance: tolerance,
      // @ts-expect-error looks-same has this option to set type of the image
      extension: 'png',
    });

    return () => new Blob([resultBuffer]);
  }
}
