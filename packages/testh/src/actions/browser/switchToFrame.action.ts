import {
  Action,
  BindingProperty,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IState,
  PropertyIsRequiredException,
  SelectorOrElement,
} from '@testh/sdk';
import { Type } from 'class-transformer';

/**
 * Properties for {@link SwitchToFrameAction}
 */
export class SwitchToFrameActionProperties implements IActionProperties {
  /**
   * IFrame selector
   */
  @BindingProperty()
  @Type(() => SelectorOrElement)
  selector: SelectorOrElement;
}

/** Action type aliases for {@link SwitchToFrameAction} */
export const SwitchToFrameActionTypeAliases = ['switch-to-frame', 'switch-frame', 'frame'] as const;

/**
 * Switches to IFrame using a selector
 * @properties {@link SwitchToFrameActionProperties}
 * @runnerType {@link SwitchToFrameActionTypeAliases}
 */
@Action(
  SwitchToFrameActionProperties,
  'Switch to frame',
  ...SwitchToFrameActionTypeAliases,
)
export class SwitchToFrameAction extends IAction<SwitchToFrameActionProperties> {
  private readonly logger: ILogger;
  constructor(
    props: SwitchToFrameActionProperties,
    loggerFactory: ILoggerFactory,
  ) {
    super(props);
    this.logger = loggerFactory.get<SwitchToFrameAction>(SwitchToFrameAction);
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.selector) {
      throw new PropertyIsRequiredException('selector');
    }

    const element = await this.props.selector.getElement(state.currentDriver);
    await state.currentDriver.switchTo().frame(element);

    this.logger.info(`Successfully changed focus to frame '${this.props.selector}'`);
  }
}
