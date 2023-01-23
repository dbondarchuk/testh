import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  StringComparison,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/** Properties for {@link CompareStringsAction} */
export class CompareStringsActionProperties implements IActionProperties {
  /** Comparison value */
  @Type(() => StringComparison)
  compare: StringComparison;

  /** Value to compare */
  to: string;
}

/** Action type aliases for {@link CompareStringsAction} */
export const CompareStringsActionTypeAliases = ['compare-strings'] as const;

/**
 * Compares two strings
 * @properties {@link CompareStringsActionProperties}
 * @runnerType {@link CompareStringsActionTypeAliases}
 * @returns {boolean} Whether {@link CompareStringsActionProperties.to} satisfies the comparison {@link CompareStringsActionProperties.compare}
 */
@Action(
  CompareStringsActionProperties,
  'Compare strings',
  ...CompareStringsActionTypeAliases,
)
export class CompareStringsAction extends IAction<
  CompareStringsActionProperties,
  boolean
> {
  private readonly logger: ILogger;
  constructor(
    props: CompareStringsActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CompareStringsAction>(CompareStringsAction);
  }

  public async run(_: IState): Promise<boolean> {
    const compare = this.props.compare;
    if (!compare) {
      throw new PropertyIsRequiredException('compare');
    }

    this.logger.info(`Comparing string '${compare}' to '${this.props.to}'`);

    const result = this.props.compare.compare(this.props.to);

    this.logger.info(
      `Value '${compare}' was${!result ? ' not' : ''} successfully matched ${
        this.props.compare
      }`,
    );

    return result;
  }
}
