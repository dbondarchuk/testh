import {
  Action,
  Assert,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
  StringComparison,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/** Properties for {@link CheckElementTextAction} */
export class CheckElementTextActionProperties implements IActionProperties {
  /** Element selector */
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;

  /** Comparison value */
  @Type(() => StringComparison)
  compare: StringComparison;
}

/** Runner type aliases for {@link CheckElementTextAction} */
export const CheckElementTextActionTypeAliases = [
  'compare-element-text',
] as const;

/**
 * Checks a web element text
 * @properties {@link CheckElementTextActionProperties}
 * @runnerType {@link CheckElementTextActionTypeAliases}
 */
@Action(CheckElementTextActionProperties, ...CheckElementTextActionTypeAliases)
export class CheckElementTextAction extends IAction<CheckElementTextActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: CheckElementTextActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<CheckElementTextAction>(
      CheckElementTextAction,
    );
  }

  public async run(state: IState): Promise<void> {
    const selector = this.props.selector;
    if (!selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await selector.getElement(state.currentDriver);
    const elementText = await element.getText();

    this.logger.info(
      `Comparing element ${selector} text '${elementText}' to '${this.props.compare}'`,
    );

    Assert.assertStringComparison(this.props.compare, elementText);

    this.logger.info(
      `Element ${selector} text successfully matched ${this.props.compare}`,
    );
  }
}
