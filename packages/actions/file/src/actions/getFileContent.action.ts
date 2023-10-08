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
 * Properties for {@link GetFileContentAction}
 */
export class GetFileContentProperties implements IActionProperties {
  /**
   * File path
   */
  @BindingProperty()
  path: string;

  /**
   * File encoding
   * @default utf-8
   */
  encoding?: BufferEncoding;
}

/** Action type aliases for {@link GetFileContentAction} */
export const GetFileContentActionTypeAliases = [
  'file-content',
  'get-file-content',
] as const;

/**
 * Gets file content as text
 * @properties {@link GetFileContentProperties}
 * @runnerType {@link GetFileContentActionTypeAliases}
 * @error {@link NotFoundException} When path doesn't exist
 * @error {@link InvalidOperationException} When path is not a file
 * @result `string` File content as text
 */
@Action(
  GetFileContentProperties,
  'Get file content',
  ...GetFileContentActionTypeAliases,
)
export class GetFileContentAction extends IAction<
  GetFileContentProperties,
  string
> {
  private readonly logger: ILogger;
  constructor(props: GetFileContentProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<GetFileContentAction>(GetFileContentAction);
  }

  public async run(): Promise<string> {
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

    const content = await $fs.readFile(path, this.props.encoding || 'utf-8');

    this.logger.info(
      `Successfully got content of the file ${path}. Content length is ${content.length}`,
    );

    return content;
  }
}
