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
 * Properties for {@link GetFileSizeAction}
 */
export class GetFileSizeProperties implements IActionProperties {
  /**
   * File path
   */
  @BindingProperty()
  path: string;
}

/** Action type aliases for {@link GetFileSizeAction} */
export const GetFileSizeActionTypeAliases = [
  'file-size',
  'get-file-size',
] as const;

/**
 * Gets file size in bytes
 * @properties {@link GetFileSizeProperties}
 * @runnerType {@link GetFileSizeActionTypeAliases}
 * @throws {NotFoundException} When path doesn't exist
 * @throws {InvalidOperationException} When path is not a file
 * @returns {number} File size in bytes
 */
@Action(GetFileSizeProperties, 'Get file size', ...GetFileSizeActionTypeAliases)
export class GetFileSizeAction extends IAction<GetFileSizeProperties, number> {
  private readonly logger: ILogger;
  constructor(props: GetFileSizeProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<GetFileSizeAction>(GetFileSizeAction);
  }

  public async run(): Promise<number> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Getting file size for '${path}'`);

    const exists = fs.existsSync(path);
    if (!exists) {
      throw new NotFoundException(`Path '${path}' doesn't exist`);
    }

    const stat = await $fs.stat(path);
    if (!stat.isFile()) {
      throw new InvalidOperationException(`Path '${path}' is not a file`);
    }

    this.logger.info(`File ${path} size is ${stat.size}`);

    return stat.size;
  }
}
