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
} from '@testh/sdk';
import { inject } from 'tsyringe';

import 'reflect-metadata';

@Service(PreStepExecutionCallbackInjectionToken)
export class ShorthandResolvePreStepCallback
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
    this.logger = loggerFactory.get<ShorthandResolvePreStepCallback>(
      ShorthandResolvePreStepCallback,
    );
  }

  async execute(step: TestStep): Promise<TestStep> {
    if (step.type || Object.keys(step).length !== 1) {
      return step;
    }

    const originalStep = step;
    const originalName = Object.keys(originalStep)[0];
    let shorthandName = originalName;
    let isMultiple = false;
    if (shorthandName.startsWith('?')) {
      isMultiple = true;
      shorthandName = shorthandName.substring(1);
    } else {
      shorthandName = getPropertyEvaluators().parseKey(shorthandName);
    }

    const actions = this.actionContainer.get();

    const action = actions[shorthandName];
    // if (!action) {
    //   throw new UnknownOptionException(
    //     `Can't find a runner for shorthand '${shorthandName}'.`,
    //   );
    // }

    this.logger.debug(`Found a shorthand for '${shorthandName}'`);

    step = {
      type: shorthandName,
      name: action?.defaultStepName,
      values: {},
    };

    if (action && !isMultiple) {
      const bindingProperty = Reflect.getMetadata(
        BindingPropertyMetadataKey,
        action.propertiesType,
      );
      if (bindingProperty) {
        this.logger.debug(
          `Found a binding propery '${bindingProperty}' for the property type '${action.propertiesType.name}'`,
        );

        const newPropertyKey = originalName.replaceAll(
          shorthandName,
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
