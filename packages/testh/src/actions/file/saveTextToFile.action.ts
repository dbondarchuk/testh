import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  InvalidOperationException,
  PropertyIsRequiredException,
} from '@testh/sdk';

import * as fs from 'fs';
import * as $fs from 'fs/promises';

/**
 * Properties for {@link SaveTextToFileAction}
 */
export class SaveTextToFileProperties implements IActionProperties {
  /**
   * File path
   */
  path: string;

  /**
   * Text to save
   */
  text: string;

  /**
   * Indicates whether to overwrite file if it alread exists
   * @default true
   */
  overwrite?: boolean;
}

/** Action type aliases for {@link SaveTextToFileAction} */
export const SaveTextToFileActionTypeAliases = [
  'save-text',
  'save-text-to-file',
  'write',
  'write-text',
  'write-text-to-file',
] as const;

/**
 * Saves text to the file
 * @properties {@link SaveTextToFileProperties}
 * @runnerType {@link SaveTextToFileActionTypeAliases}
 * @throws {InvalidOperationException} When file exists and not allowed to overwrite
 */
@Action(
  SaveTextToFileProperties,
  'Save blob to file',
  ...SaveTextToFileActionTypeAliases,
)
export class SaveTextToFileAction extends IAction<SaveTextToFileProperties> {
  private readonly logger: ILogger;
  constructor(props: SaveTextToFileProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<SaveTextToFileAction>(SaveTextToFileAction);
  }

  public async run(): Promise<void> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Saving text content to file '${path}'`);

    const exists = fs.existsSync(path);
    if (exists && this.props.overwrite === false) {
      throw new InvalidOperationException(`Path '${path}' already exists`);
    }

    await $fs.writeFile(path, this.props.text || '');

    this.logger.info(`Successfully wrote text to the file ${path}`);
  }
}
