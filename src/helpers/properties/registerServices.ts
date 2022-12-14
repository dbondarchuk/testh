import { container } from "tsyringe";
import { PropertiesEvaluatorInjectionToken } from "./iPropertiesEvaluator";
import { PropertyEvaluatorInjectionToken } from "./iPropertyEvaluator";
import { PropertiesEvaluator } from "./propertiesEvaluator";
import { DefaultPropertyEvaluator } from "./property/defaultPropertyEvaluator";
import { DollarSignPropertyEvaluator } from "./property/dollarSignPropertyEvaluator";
import { DoNotEvaluatePropertyEvaluator } from "./property/doNotEvaluatePropertyEvaluator";
import { RunActionsPropertyEvaluator } from "./property/runActionsPropertyEvaluator";
import { StepsPropertyEvaluator } from "./property/stepsPropertyEvaluator";

/** Registers default implementations for property evaluators */
export const registerEvaluatorsServices = (): void => {
    container.registerSingleton(PropertyEvaluatorInjectionToken, DefaultPropertyEvaluator);
    container.registerSingleton(PropertyEvaluatorInjectionToken, DollarSignPropertyEvaluator);
    container.registerSingleton(PropertyEvaluatorInjectionToken, DoNotEvaluatePropertyEvaluator);
    container.registerSingleton(PropertyEvaluatorInjectionToken, RunActionsPropertyEvaluator);
    container.registerSingleton(PropertyEvaluatorInjectionToken, StepsPropertyEvaluator);
    
    container.registerSingleton(
      PropertiesEvaluatorInjectionToken,
      PropertiesEvaluator,
    );
}