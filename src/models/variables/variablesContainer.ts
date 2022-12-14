import { env } from 'process';
import * as os from 'os';

import { container } from 'tsyringe';

import { version } from '../../../package.json';
import { Variables } from './variables';
import {
  IPropertiesEvaluator,
  PropertiesEvaluatorInjectionToken,
} from '../../helpers/properties/iPropertiesEvaluator';
import { IStepsRunner, StepsRunnerInjectionToken } from '../../helpers/steps/iStepsRunner';
import { TestStep } from '../tests/testStep';
import { stepsWrapper } from '../tests/testSteps';
import { State } from '../actions/testRunState';

/**
 * Contains variables for the current run
 */
export class VariablesContainer {
  public static readonly AGENT_PREFIX = 'AGENT_';
  public static readonly TASK_PREFIX = 'TASK_';
  public static readonly BROWSER_PREFIX = 'BROWSER_';
  public static readonly API_PREFIX = 'API_';

  public static readonly TASK_TEST_NAME =
    VariablesContainer.TASK_PREFIX + 'TEST_NAME';
  public static readonly TASK_STEP_NUMBER =
    VariablesContainer.TASK_PREFIX + 'STEP_NUMBER';
  public static readonly TASK_STEPS_DONE =
    VariablesContainer.TASK_PREFIX + 'STEPS_DONE';
  public static readonly TASK_TOTAL_STEPS =
    VariablesContainer.TASK_PREFIX + 'TOTAL_STEPS';
    public static readonly TASK_START_TIME =
      VariablesContainer.TASK_PREFIX + 'START_TIME';
      public static readonly TASK_EXECUTION_TIME =
        VariablesContainer.TASK_PREFIX + 'EXECUTION_TIME';

  public static readonly AGENT_IP_ADDRESS =
    VariablesContainer.AGENT_PREFIX + 'IP_ADDRESS';
  public static readonly AGENT_HOST_NAME =
    VariablesContainer.AGENT_PREFIX + 'HOSTNAME';
  public static readonly AGENT_OS_NAME =
    VariablesContainer.AGENT_PREFIX + 'OS_NAME';
  public static readonly AGENT_OS_VERSION =
    VariablesContainer.AGENT_PREFIX + 'OS_VERSION';
  public static readonly AGENT_ARCHITECTURE =
    VariablesContainer.AGENT_PREFIX + 'ARCHITECTURE';
  public static readonly AGENT_VERSION =
    VariablesContainer.AGENT_PREFIX + 'VERSION';

  public static readonly BROWSER_LAST_LOAD_TIME =
    VariablesContainer.BROWSER_PREFIX + 'LAST_LOAD_TIME';
  public static readonly BROWSER_LOAD_TIMES =
    VariablesContainer.BROWSER_PREFIX + 'LOAD_TIMES';

  public static readonly API_LOAD_TIMES =
    VariablesContainer.API_PREFIX + 'LOAD_TIMES';

  public static readonly RUN = 'run';

  private _variables: Variables = {};

  /**
   * Creates new instance of Variables
   * @param state Reference to the current run state
   * @param variables Initial variables
   */
  public constructor(private readonly state: State, variables?: Variables) {
    this.initVariables(variables);
  }

  private static fixVariableName(name: string): string {
    return name.replaceAll(
      /[(|)|\s|\\|[|\]|{|}|\-|:|=|/]/g,
      '_',
    );
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

    this.put(VariablesContainer.TASK_TEST_NAME, this.state.testName);
    this.put(VariablesContainer.TASK_START_TIME, Date.now());
    this.put(VariablesContainer.TASK_EXECUTION_TIME, () => Date.now() - this.get(VariablesContainer.TASK_START_TIME));

    if (variables) {
      Object.keys(variables).forEach((key) => this.put(key, variables[key]));
    }
  }

  private initAgentVariables(): void {
    this.put(
      VariablesContainer.AGENT_IP_ADDRESS,
      VariablesContainer.getIpAddress(),
    );
    this.put(VariablesContainer.AGENT_HOST_NAME, os.hostname());
    this.put(VariablesContainer.AGENT_OS_NAME, os.platform());
    this.put(VariablesContainer.AGENT_OS_VERSION, os.version());
    this.put(VariablesContainer.AGENT_ARCHITECTURE, os.arch());
    this.put(VariablesContainer.AGENT_VERSION, version);
  }

  private initRunCommand(): void {
    const run = (stepType: string, properties: any): Promise<any[]> => {
      return (async (): Promise<any[]> => {
        const runner = container.resolve<IStepsRunner>(StepsRunnerInjectionToken);
        const step: TestStep = {
          name: `Execute ${stepType}`,
          type: stepType,
          values: properties
        };

        const currentStep = getCurrentStepNumber(this).toString();

        const results = await runner.runTestSteps(
          stepsWrapper([step]),
          this.state,
          (stepNumber) => `${currentStep}-execute-${stepNumber}`);

        return results;
      })();
    }

    this.put(VariablesContainer.RUN, run)
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

/**
 * Updates number of the step which is been executed
 * @param variables Variables list
 * @param num New step number
 */
export const updateStepNumber = (
  variables: VariablesContainer,
  num: number | string,
): void => {
  variables.put(VariablesContainer.TASK_STEP_NUMBER, num);
};

/**
 * Gets current number of the step which is been executed
 * @param variables Variables list
 * @returns Current step number
 */
export const getCurrentStepNumber = (
  variables: VariablesContainer,
): number | string => variables.get(VariablesContainer.TASK_STEP_NUMBER);
