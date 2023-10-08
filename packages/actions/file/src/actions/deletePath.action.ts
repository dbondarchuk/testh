import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  NotFoundException,
  PropertyIsRequiredException,
} from '@testh/sdk';

import * as fs from 'fs';
import * as $fs from 'fs/promises';

/**
 * Properties for {@link DeletePathAction}
 */
export class DeletePathProperties implements IActionProperties {
  /**
   * File path
   */
  @BindingProperty()
  path: string;
}

/** Action type aliases for {@link DeletePathAction} */
export const DeletePathActionTypeAliases = [
  'rm',
  'rmdir',
  'remove-file',
  'delete-file',
  'remove-folder',
  'delete-folder',
] as const;

/**
 * Deletes file or folder (recursively)
 * @properties {@link DeletePathProperties}
 * @runnerType {@link DeletePathActionTypeAliases}
 * @error {@link NotFoundException} When path doesn't exist
 */
@Action(DeletePathProperties, 'Delete file', ...DeletePathActionTypeAliases)
export class DeletePathAction extends IAction<DeletePathProperties> {
  private readonly logger: ILogger;
  constructor(props: DeletePathProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<DeletePathAction>(DeletePathAction);
  }

  public async run(): Promise<void> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Removing path '${path}'`);

    const exists = fs.existsSync(path);
    if (!exists) {
      throw new NotFoundException(`Path '${path}' doesn't exist`);
    }

    await $fs.rm(this.props.path, {
      force: false,
      recursive: true,
    });

    this.logger.info(`Successfully removed path ${path}`);
  }
}
