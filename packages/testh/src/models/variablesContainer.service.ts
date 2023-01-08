import { env } from 'process';
import * as os from 'os';

import { container, inject } from 'tsyringe';

import { version } from '../../package.json';
import {
  AGENT_ARCHITECTURE,
  AGENT_HOST_NAME,
  AGENT_IP_ADDRESS,
  AGENT_OS_NAME,
  AGENT_OS_VERSION,
  AGENT_VERSION,
  getCurrentStepNumber,
  IPropertiesEvaluator,
  IState,
  IStepsRunner,
  IVariablesContainer,
  PropertiesEvaluatorInjectionToken,
  RUN,
  Service,
  StateInstanceInjectionToken,
  StepsRunnerInjectionToken,
  stepsWrapper,
  TASK_EXECUTION_TIME,
  TASK_START_TIME,
  TASK_TEST_NAME,
  Test,
  TestInstanceInjectionToken,
  TestStep,
  Variables,
  VariablesContainerInjectionToken,
} from '@testh/sdk';

/**
 * Contains variables for the current run
 */
@Service(VariablesContainerInjectionToken)
export class VariablesContainer implements IVariablesContainer {
  private _variables: Variables = {};

  /**
   * Creates new instance of Variables
   * @param state Reference to the current run state
   * @param variables Initial variables
   */
  public constructor(
    @inject(StateInstanceInjectionToken) private readonly state: IState,
    @inject(TestInstanceInjectionToken) test?: Test,
  ) {
    this.initVariables(test?.variables);
  }

  private static fixVariableName(name: string): string {
    return name.replaceAll(/[(|)|\s|\\|[|\]|{|}|\-|:|=|/]/g, '_');
  }

  /**
   * Gets variables
   */
  public get variables(): Variables {
    return this._variables;
  }

  /**
   * Gets a variable by it's name
   * @param key Variable name
   * @returns {any|undefined} Variable value. Undefined if variable doesn't exist
   */
  public get(key: string): any | undefined {
    const root =
      key.indexOf('.') >= 0 ? key.substring(0, key.indexOf('.')) : key;

    if (!Object.hasOwn(this._variables, root)) {
      return undefined;
    }

    const value = this._variables[key];
    if (key.indexOf('.') < 0) {
      return value;
    }

    return container
      .resolve<IPropertiesEvaluator>(PropertiesEvaluatorInjectionToken)
      .evaluate(key, this._variables);
  }

  /**
   * Adds or replaces variable
   * @param key Variable name
   * @param value Variable value
   * @returns Fixed variable name
   */
  public put(key: string, value: any): string {
    key = VariablesContainer.fixVariableName(key);
    this._variables[key] = value;

    return key;
  }

  /**
   * Creates a new variables with the specified base variables, merged with the current ones
   * @param baseVariables Base variables
   * @returns Merged variables
   */
  public _merge(baseVariables: Variables): VariablesContainer {
    const merged = new VariablesContainer(this.state);
    merged._variables = { ...baseVariables, ...this.variables };

    return merged;
  }

  /**
   * Merges with the specified base variables, merged with the current ones
   * @param baseVariables Base variables
   * @returns Merged variables
   */
  public merge(baseVariables: Variables): VariablesContainer {
    this._variables = { ...baseVariables, ...this.variables };

    return this;
  }

  private initVariables(variables?: Variables): void {
    // add environment vars
    Object.keys(env).forEach((key) => this.put(key, env[key]));

    this.initAgentVariables();
    this.initRunCommand();

    this.put(TASK_TEST_NAME, this.state.testName);
    this.put(TASK_START_TIME, Date.now());
    this.put(TASK_EXECUTION_TIME, () => Date.now() - this.get(TASK_START_TIME));

    if (variables) {
      Object.keys(variables).forEach((key) => this.put(key, variables[key]));
    }
  }

  private initAgentVariables(): void {
    this.put(AGENT_IP_ADDRESS, VariablesContainer.getIpAddress());
    this.put(AGENT_HOST_NAME, os.hostname());
    this.put(AGENT_OS_NAME, os.platform());
    this.put(AGENT_OS_VERSION, os.version());
    this.put(AGENT_ARCHITECTURE, os.arch());
    this.put(AGENT_VERSION, version);
  }

  private initRunCommand(): void {
    const run = (stepType: string, properties: any): Promise<any[]> => {
      return (async (): Promise<any[]> => {
        const runner = container.resolve<IStepsRunner>(
          StepsRunnerInjectionToken,
        );
        const step: TestStep = {
          name: `Execute ${stepType}`,
          type: stepType,
          values: properties,
        };

        const currentStep = getCurrentStepNumber(this).toString();

        const results = await runner.runTestSteps(
          stepsWrapper([step]),
          this.state,
          (stepNumber) => `${currentStep}-execute-${stepNumber}`,
        );

        return results;
      })();
    };

    this.put(RUN, run);
  }

  private static getIpAddress(): string {
    const interfaces = os.networkInterfaces();
    for (const k in interfaces) {
      for (const k2 in interfaces[k]) {
        const address = interfaces[k][k2];
        if (address.family === 'IPv4' && !address.internal) {
          return address.address;
        }
      }
    }

    return undefined;
  }
}
