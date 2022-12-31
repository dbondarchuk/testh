import {
  IContainer,
  PropertiesEvaluatorContainerToken,
  PropertyEvaluatorContainerToken,
} from '@testh/sdk';
import { PropertiesEvaluator } from './propertiesEvaluator';
import { DefaultPropertyEvaluator } from './property/defaultPropertyEvaluator';
import { DollarSignPropertyEvaluator } from './property/dollarSignPropertyEvaluator';
import { DoNotEvaluatePropertyEvaluator } from './property/doNotEvaluatePropertyEvaluator';
import { RunActionsPropertyEvaluator } from './property/runActionsPropertyEvaluator';
import { StepsPropertyEvaluator } from './property/stepsPropertyEvaluator';

/** Registers default implementations for property evaluators */
export const registerEvaluatorsServices = (): void => {
  IContainer.instance.registerSingleton(
    PropertyEvaluatorContainerToken,
    DefaultPropertyEvaluator,
  );
  IContainer.instance.registerSingleton(
    PropertyEvaluatorContainerToken,
    DollarSignPropertyEvaluator,
  );
  IContainer.instance.registerSingleton(
    PropertyEvaluatorContainerToken,
    DoNotEvaluatePropertyEvaluator,
  );
  IContainer.instance.registerSingleton(
    PropertyEvaluatorContainerToken,
    RunActionsPropertyEvaluator,
  );
  IContainer.instance.registerSingleton(
    PropertyEvaluatorContainerToken,
    StepsPropertyEvaluator,
  );

  IContainer.instance.registerSingleton(
    PropertiesEvaluatorContainerToken,
    PropertiesEvaluator,
  );
};
