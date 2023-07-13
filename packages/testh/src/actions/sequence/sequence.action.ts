import {
  Action,
  BindingProperty,
  Constructor,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  IPropertiesEvaluator,
  IState,
  PropertiesEvaluatorInjectionToken,
  PropertyIsRequiredException,
  resolve,
  resolveAll,
  UnknownOptionException,
} from '@testh/sdk';
import { plainToClass } from 'class-transformer';
import { Actions } from 'selenium-webdriver';

/** Base type properties for the sequence action */
export type ISequenceActionProperties = Record<string, any>;

/** Describes a step of the sequence */
export interface ISequenceAction<Props extends ISequenceActionProperties> {
  /** Gets type of the step */
  get type(): string;

  /** Gets type of the properties */
  get propsType(): Constructor<Props>;

  /**
   * Adds a new step to the Selenium Actions
   * @param sequence Current actions builder
   * @param state Current test state
   * @param step Sequence step
   * @returns Result builder
   */
  execute(sequence: Actions, state: IState, props: Props): Promise<Actions>;
}

/** Injection token for sequence action */
export const SequenceActionInjectionToken = 'SequenceAction';

/** Describes a step for the sequence */
export interface SequenceStep {
  /** Type of the sequence */
  type: string;

  /** Values for the sequence */
  values: ISequenceActionProperties;
}

/**
 * Properties for {@link SequenceAction}
 */
export class SequenceActionProperties implements IActionProperties {
  /** Actions to run */
  @BindingProperty()
  actions: SequenceStep[];
}

/** Action type aliases for {@link SequenceAction} */
export const SequenceActionTypeAliases = ['sequence'] as const;

/**
 * Runs specific sequence of actions, which will be executed after the last one
 * @properties {@link SequenceActionProperties}
 * @runnerType {@link SequenceActionTypeAliases}
 */
@Action(SequenceActionProperties, 'Run sequnce', ...SequenceActionTypeAliases)
export class SequenceAction extends IAction<SequenceActionProperties> {
  private readonly logger: ILogger;
  constructor(props: SequenceActionProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<SequenceAction>(SequenceAction);
  }

  public async run(state: IState): Promise<void> {
    if (!this.props.actions) {
      throw new PropertyIsRequiredException('actions');
    }

    const sequenceActions = resolveAll<
      ISequenceAction<ISequenceActionProperties>
    >(SequenceActionInjectionToken).reduce((obj, current) => {
      obj[current.type] = current;
      return obj;
    }, {} as Record<string, ISequenceAction<ISequenceActionProperties>>);

    let sequence = state.currentDriver.actions();

    const propertiesEvaluator = resolve<IPropertiesEvaluator>(
      PropertiesEvaluatorInjectionToken,
    );

    this.logger.info(`Executing ${this.props.actions.length} sequence actions`);
    for (const action of this.props.actions) {
      const sequenceAction = sequenceActions[action.type];
      if (!sequenceAction) {
        throw new UnknownOptionException(
          `Unknown sequence action type: '${action.type}'`,
        );
      }

      const propsPlain = await propertiesEvaluator.evaluateProperties(
        action.values,
        state,
        sequenceAction.propsType,
      );

      const props = plainToClass(sequenceAction.propsType, propsPlain);
      this.logger.debug(`Running sequence action of type '${action.type}'`);

      sequence = await sequenceAction.execute(sequence, state, props);
    }

    await sequence.perform();

    this.logger.info(
      `Successfully executed ${this.props.actions.length} sequence actions`,
    );
  }
}
