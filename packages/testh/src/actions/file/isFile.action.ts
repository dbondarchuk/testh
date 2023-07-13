import {
  Action,
  BindingProperty,
  NotFoundException,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  PropertyIsRequiredException,
  InvalidOperationException,
} from '@testh/sdk';

import * as fs from 'fs';
import * as $fs from 'fs/promises';

/**
 * Properties for {@link IsFileAction}
 */
export class IsFileProperties implements IActionProperties {
  /**
   * File path
   */
  @BindingProperty()
  path: string;
}

/** Action type aliases for {@link IsFileAction} */
export const IsFileActionTypeAliases = ['is-file'] as const;

/**
 * Gets whether a path is file or folder
 * @properties {@link IsFileProperties}
 * @runnerType {@link IsFileActionTypeAliases}
 * @throws {NotFoundException} When path doesn't exist
 * @throws {InvalidOperationException} When path is neither file nor directory
 * @returns {boolean} Returns true when path is file, false when it's folder
 */
@Action(
  IsFileProperties,
  'Get whether path is file',
  ...IsFileActionTypeAliases,
)
export class IsFileAction extends IAction<IsFileProperties, boolean> {
  private readonly logger: ILogger;
  constructor(props: IsFileProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<IsFileAction>(IsFileAction);
  }

  public async run(): Promise<boolean> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Checking whether path '${path}' is file or directory`);

    const exists = fs.existsSync(path);
    if (!exists) {
      throw new NotFoundException(`Path '${path}' doesn't exist`);
    }

    const stat = await $fs.stat(path);
    const isFile = stat.isFile();
    const isDirectiry = stat.isDirectory();

    if (!isFile && !isDirectiry) {
      throw new InvalidOperationException(
        `Path '${path}' is neither file nor directory`,
      );
    }

    this.logger.info(`Path ${path} is ${isFile ? 'file' : 'directory'}`);

    return isFile;
  }
}
