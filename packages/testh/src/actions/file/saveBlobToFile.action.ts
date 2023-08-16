import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  PropertyIsRequiredException,
  InvalidOperationException,
  Safe,
  ToBoolean,
} from '@testh/sdk';

import * as fs from 'fs';
import * as $fs from 'fs/promises';

/**
 * Properties for {@link SaveBlobToFileAction}
 */
export class SaveBlobToFileProperties implements IActionProperties {
  /**
   * File path
   */
  path: string;

  /**
   * Blob to save
   */
  blob: Safe<Blob>;

  /**
   * Indicates whether to overwrite file if it alread exists
   * @default true
   */
  @ToBoolean()
  overwrite?: boolean;
}

/** Action type aliases for {@link SaveBlobToFileAction} */
export const SaveBlobToFileActionTypeAliases = [
  'save',
  'save-blob',
  'save-blob-to-file',
] as const;

/**
 * Saves {@link Blob} blob to the file
 * Is useful for downloading files via HTTP
 * @properties {@link SaveBlobToFileProperties}
 * @runnerType {@link SaveBlobToFileActionTypeAliases}
 * @error {@link InvalidOperationException} When file exists and not allowed to overwrite
 */
@Action(
  SaveBlobToFileProperties,
  'Save blob to file',
  ...SaveBlobToFileActionTypeAliases,
)
export class SaveBlobToFileAction extends IAction<SaveBlobToFileProperties> {
  private readonly logger: ILogger;
  constructor(props: SaveBlobToFileProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<SaveBlobToFileAction>(SaveBlobToFileAction);
  }

  public async run(): Promise<void> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    if (!this.props.blob) {
      throw new PropertyIsRequiredException('blob');
    }

    this.logger.info(`Saving content to file '${path}'`);

    const exists = fs.existsSync(path);
    if (exists && this.props.overwrite === false) {
      throw new InvalidOperationException(`Path '${path}' already exists`);
    }

    await $fs.writeFile(path, this.props.blob().stream());

    this.logger.info(`Successfully wrote blob to the file ${path}`);
  }
}
