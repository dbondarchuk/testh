import { env } from 'process';
import * as os from 'os';
import { JsEngine } from '../../helpers/js/jsEngine';

import { version } from '../../../package.json';
import { Variables } from './variables';

/**
 * Contains variables for the current run
 */
export class VariablesContainer {
  public static readonly AGENT_PREFIX = 'Agent_';
  public static readonly TASK_PREFIX = 'Task_';
  public static readonly BROWSER_PREFIX = 'Browser_';
  public static readonly API_PREFIX = 'Api_';

  public static readonly TASK_TASK_ID = VariablesContainer.TASK_PREFIX + 'TaskId';
  public static readonly TASK_TEST_ID = VariablesContainer.TASK_PREFIX + 'TestId';
  public static readonly TASK_TEST_NAME = VariablesContainer.TASK_PREFIX + 'TestName';
  public static readonly TASK_IS_MONITORING =
    VariablesContainer.TASK_PREFIX + 'IsMonitoring';
  public static readonly TASK_STEP_NUMBER =
    VariablesContainer.TASK_PREFIX + 'StepNumber';
  public static readonly TASK_STEPS_DONE = VariablesContainer.TASK_PREFIX + 'StepsDone';
  public static readonly TASK_TOTAL_STEPS =
    VariablesContainer.TASK_PREFIX + 'TotalSteps';

  public static readonly AGENT_IP_ADDRESS =
    VariablesContainer.AGENT_PREFIX + 'IpAddress';
  public static readonly AGENT_HOST_NAME = VariablesContainer.AGENT_PREFIX + 'HostName';
  public static readonly AGENT_OS_NAME = VariablesContainer.AGENT_PREFIX + 'OsName';
  public static readonly AGENT_OS_VERSION =
    VariablesContainer.AGENT_PREFIX + 'OsVersion';
  public static readonly AGENT_ARCHITECTURE =
    VariablesContainer.AGENT_PREFIX + 'Architecture';
  public static readonly AGENT_VERSION = VariablesContainer.AGENT_PREFIX + 'Version';

  public static readonly BROWSER_LAST_LOAD_TIME =
    VariablesContainer.BROWSER_PREFIX + 'LastLoadTime';
  public static readonly BROWSER_LOAD_TIMES =
    VariablesContainer.BROWSER_PREFIX + 'LoadTimes';

  public static readonly API_LOAD_TIMES = VariablesContainer.API_PREFIX + 'LoadTimes';

  private _variables: Variables = {};

  /**
   * Creates new instance of Variables
   * @param variables Initial variables
   */
  public constructor(variables?: Variables) {
    this.initVariables(variables);
  }

  private static fixVariableName(name: string): string {
    return name.replaceAll(
      '[\\(|\\)|\\s|\\\\|\\[|\\]|\\{|\\}|\\-|\\:|\\=|\\/]',
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

    return JsEngine.evaluate(key, this._variables);
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
    const merged = new VariablesContainer();
    merged._variables = {...baseVariables, ...this.variables};

    return merged;
  }

  /**
   * Merges with the specified base variables, merged with the current ones
   * @param baseVariables Base variables
   * @returns Merged variables
   */
  public merge(baseVariables: Variables): VariablesContainer {
    this._variables = {...baseVariables, ...this.variables};

    return this;
  }

  private initVariables(variables?: Variables): void {
    // add environment vars
    Object.keys(env).forEach((key) => this.put(key, env[key]));

    this.initAgentVariables();

    if (variables) {
      Object.keys(variables).forEach((key) => this.put(key, variables[key]));
    }
  }

  private initAgentVariables(): void {
    this.put(VariablesContainer.AGENT_IP_ADDRESS, VariablesContainer.getIpAddress());
    this.put(VariablesContainer.AGENT_HOST_NAME, os.hostname());
    this.put(VariablesContainer.AGENT_OS_NAME, os.platform());
    this.put(VariablesContainer.AGENT_OS_VERSION, os.version());
    this.put(VariablesContainer.AGENT_ARCHITECTURE, os.arch());
    this.put(VariablesContainer.AGENT_VERSION, version);
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
  variables: VariablesContainer
): number | string => variables.get(VariablesContainer.TASK_STEP_NUMBER);