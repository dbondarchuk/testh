import {
  ActionContainerInjectionToken,
  BindingPropertyMetadataKey,
  getPropertyEvaluators,
  IActionContainer,
  ILogger,
  ILoggerFactory,
  IPreStepExecutionCallback,
  IPropertiesEvaluator,
  LoggerFactoryInjectionToken,
  PreStepExecutionCallbackInjectionToken,
  PropertiesEvaluatorInjectionToken,
  Service,
  TestStep,
  UnknownOptionException,
} from '@testh/sdk';
import { inject } from 'tsyringe';

import 'reflect-metadata';

@Service(PreStepExecutionCallbackInjectionToken)
export class ShortcutResolvePreStepCallback
  implements IPreStepExecutionCallback
{
  private readonly logger: ILogger;

  constructor(
    @inject(ActionContainerInjectionToken)
    private readonly actionContainer: IActionContainer,
    @inject(PropertiesEvaluatorInjectionToken)
    protected readonly propertiesEvaluator: IPropertiesEvaluator,
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
  ) {
    this.logger = loggerFactory.get<ShortcutResolvePreStepCallback>(
      ShortcutResolvePreStepCallback,
    );
  }

  async execute(step: TestStep): Promise<TestStep> {
    if (step.type || Object.keys(step).length !== 1) {
      return step;
    }

    const originalStep = step;
    const originalName = Object.keys(originalStep)[0];
    let shortcutName = originalName;
    let isMultiple = false;
    if (shortcutName.startsWith('?')) {
      isMultiple = true;
      shortcutName = shortcutName.substring(1);
    } else {
      shortcutName = getPropertyEvaluators().parseKey(shortcutName);
    }

    const actions = this.actionContainer.get();

    const action = actions[shortcutName];
    if (!action) {
      throw new UnknownOptionException(
        `Can't find a runner for shortcut '${shortcutName}'.`,
      );
    }

    this.logger.debug(`Found a shortcut for '${shortcutName}'`);

    step = {
      type: shortcutName,
      name: action.defaultStepName,
      values: {},
    };

    if (!isMultiple) {
      const bindingProperty = Reflect.getMetadata(
        BindingPropertyMetadataKey,
        action.propertiesType,
      );
      if (bindingProperty) {
        this.logger.debug(
          `Found a binding propery '${bindingProperty}' for the property type '${action.propertiesType.name}'`,
        );

        const newPropertyKey = originalName.replaceAll(
          shortcutName,
          bindingProperty,
        );

        this.logger.debug(`Setting property '${newPropertyKey}'`);
        step.values[newPropertyKey] = originalStep[originalName];
      } else {
        this.logger.debug(
          `No binding property were found. Setting original value as step values`,
        );
        step.values = originalStep[originalName];
      }
    } else {
      for (const propertyKey of Object.keys(originalStep[originalName])) {
        step.values[propertyKey] = originalStep[originalName][propertyKey];
      }
    }

    return step;
  }
}
