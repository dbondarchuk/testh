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
 * Properties for {@link GetFileBlobAction}
 */
export class GetFileBlobProperties implements IActionProperties {
  /**
   * File path
   */
  @BindingProperty()
  path: string;
}

/** Action type aliases for {@link GetFileBlobAction} */
export const GetFileBlobActionTypeAliases = [
  'file-blob',
  'get-file-blob',
] as const;

/**
 * Gets file content as {@link Blob} blob
 * Is useful for uploading files via HTTP
 * @properties {@link GetFileBlobProperties}
 * @runnerType {@link GetFileBlobActionTypeAliases}
 * @throws {NotFoundException} When path doesn't exist
 * @throws {InvalidOperationException} When path is not a file
 * @returns {Blob} File content as blob
 */
@Action(GetFileBlobProperties, 'Get file blob', ...GetFileBlobActionTypeAliases)
export class GetFileBlobAction extends IAction<GetFileBlobProperties, Blob> {
  private readonly logger: ILogger;
  constructor(props: GetFileBlobProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<GetFileBlobAction>(GetFileBlobAction);
  }

  public async run(): Promise<Blob> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Getting content of file '${path}' as text`);

    const exists = fs.existsSync(path);
    if (!exists) {
      throw new NotFoundException(`Path '${path}' doesn't exist`);
    }

    const stat = await $fs.stat(path);
    if (!stat.isFile()) {
      throw new InvalidOperationException(`Path '${path}' is not a file`);
    }

    const buffer = await $fs.readFile(path);
    const blob = new Blob([buffer]);

    this.logger.info(`Successfully got content of the file ${path} as blob`);

    return blob;
  }
}
