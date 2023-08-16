import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  PropertyIsRequiredException,
  Safe,
  ToBoolean,
} from '@testh/sdk';

import * as AdmZip from 'adm-zip';

/**
 * Properties for {@link UnzipFileAction}
 */
export class UnzipFileProperties implements IActionProperties {
  /**
   * File to unzip
   */
  zip: Safe<Blob>;

  /**
   * Path to where to unzip
   */
  path: string;

  /**
   * Indicates whether to overwrite files if it alread exists
   * @default true
   */
  @ToBoolean()
  overwrite?: boolean;
}

/** Action type aliases for {@link UnzipFileAction} */
export const UnzipFileActionTypeAliases = ['unzip', 'unzip-file'] as const;

/**
 * Unzip files
 * @properties {@link UnzipFileProperties}
 * @runnerType {@link UnzipFileActionTypeAliases}
 */
@Action(UnzipFileProperties, 'Unzip files', ...UnzipFileActionTypeAliases)
export class UnzipFileAction extends IAction<UnzipFileProperties, void> {
  private readonly logger: ILogger;
  constructor(props: UnzipFileProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<UnzipFileAction>(UnzipFileAction);
  }

  public async run(): Promise<void> {
    if (!this.props.path) {
      throw new PropertyIsRequiredException('path');
    }

    if (!this.props.zip) {
      throw new PropertyIsRequiredException('zip');
    }

    this.logger.info(`Unzipping a file.`);

    const arrayBuffer = await this.props.zip().arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const zip = new AdmZip(buffer);

    const promise = new Promise((resolve, reject) => {
      zip.extractAllToAsync(
        this.props.path,
        this.props.overwrite !== false,
        true,
        (error?: Error) => {
          if (error) {
            reject(error);
          } else {
            resolve(undefined);
          }
        },
      );
    });

    await promise;
  }
}
