import {
  Action,
  BindingProperty,
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
 * Properties for {@link CreateDirectoryAction}
 */
export class CreateDirectoryProperties implements IActionProperties {
  /**
   * Directory path
   */
  @BindingProperty()
  path: string;
}

/** Action type aliases for {@link CreateDirectoryAction} */
export const CreateDirectoryActionTypeAliases = [
  'mkdir',
  'create-folder',
  'create-directory',
] as const;

/**
 * Creates folder recursively
 * @properties {@link CreateDirectoryProperties}
 * @runnerType {@link CreateDirectoryActionTypeAliases}
 * @error {@link InvalidOperationException} When path already exists
 */
@Action(
  CreateDirectoryProperties,
  'Create folder',
  ...CreateDirectoryActionTypeAliases,
)
export class CreateDirectoryAction extends IAction<CreateDirectoryProperties> {
  private readonly logger: ILogger;
  constructor(props: CreateDirectoryProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<CreateDirectoryAction>(
      CreateDirectoryAction,
    );
  }

  public async run(): Promise<void> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Creating folder structure '${path}'`);

    const exists = fs.existsSync(path);
    if (exists) {
      throw new InvalidOperationException(`Path '${path}' already exists`);
    }

    await $fs.mkdir(this.props.path, { recursive: true });

    this.logger.info(`Successfully created folder ${path}`);
  }
}
