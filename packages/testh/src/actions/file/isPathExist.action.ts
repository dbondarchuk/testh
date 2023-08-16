import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  PropertyIsRequiredException,
} from '@testh/sdk';

import * as fs from 'fs';

/**
 * Properties for {@link IsPathExistAction}
 */
export class IsPathExistProperties implements IActionProperties {
  /**
   * File path
   */
  @BindingProperty()
  path: string;
}

/** Action type aliases for {@link IsPathExistAction} */
export const IsPathExistActionTypeAliases = ['path-exist'] as const;

/**
 * Gets whether a path (either file or folder) exists
 * @properties {@link IsPathExistProperties}
 * @runnerType {@link IsPathExistActionTypeAliases}
 * @result `boolean` Whether the path exist
 */
@Action(
  IsPathExistProperties,
  'Get whether path exists',
  ...IsPathExistActionTypeAliases,
)
export class IsPathExistAction extends IAction<IsPathExistProperties, boolean> {
  private readonly logger: ILogger;
  constructor(props: IsPathExistProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<IsPathExistAction>(IsPathExistAction);
  }

  public async run(): Promise<boolean> {
    const path = this.props.path;
    if (!path) {
      throw new PropertyIsRequiredException('path');
    }

    this.logger.info(`Checking whether path '${path}' exists`);

    const exists = fs.existsSync(path);

    this.logger.info(
      `Path ${path} ${!exists ? ' does not' : ''} exist${exists ? 's' : ''}`,
    );

    return exists;
  }
}
