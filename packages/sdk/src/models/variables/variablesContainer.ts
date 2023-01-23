import { IState } from '../tests';
import { Variables } from './variables';

export const AGENT_PREFIX = 'AGENT_';
export const TASK_PREFIX = 'TASK_';
export const BROWSER_PREFIX = 'BROWSER_';
export const API_PREFIX = 'API_';

export const TASK_TEST_NAME = TASK_PREFIX + 'TEST_NAME';
export const TASK_STEP_NUMBER = TASK_PREFIX + 'STEP_NUMBER';
export const TASK_STEPS_DONE = TASK_PREFIX + 'STEPS_DONE';
export const TASK_TOTAL_STEPS = TASK_PREFIX + 'TOTAL_STEPS';
export const TASK_START_TIME = TASK_PREFIX + 'START_TIME';
export const TASK_EXECUTION_TIME = TASK_PREFIX + 'EXECUTION_TIME';

export const AGENT_IP_ADDRESS = AGENT_PREFIX + 'IP_ADDRESS';
export const AGENT_HOST_NAME = AGENT_PREFIX + 'HOSTNAME';
export const AGENT_OS_NAME = AGENT_PREFIX + 'OS_NAME';
export const AGENT_OS_VERSION = AGENT_PREFIX + 'OS_VERSION';
export const AGENT_ARCHITECTURE = AGENT_PREFIX + 'ARCHITECTURE';
export const AGENT_VERSION = AGENT_PREFIX + 'VERSION';

export const BROWSER_LAST_LOAD_TIME = BROWSER_PREFIX + 'LAST_LOAD_TIME';
export const BROWSER_LOAD_TIMES = BROWSER_PREFIX + 'LOAD_TIMES';

export const API_LOAD_TIMES = API_PREFIX + 'LOAD_TIMES';

export const RUN = 'run';

/**
 * Contains variables for the current run
 */
export interface IVariablesContainer {
  /**
   * Gets variables
   */
  get variables(): Variables;

  /**
   * Gets a variable by it's name
   * @param key Variable name
   * @returns {any|undefined} Variable value. Undefined if variable doesn't exist
   */
  get(key: string): any | undefined;

  /**
   * Adds or replaces variable
   * @param key Variable name
   * @param value Variable value
   * @returns Fixed variable name
   */
  put(key: string, value: any): string;

  /**
   * Merges with the specified base variables, merged with the current ones
   * @param baseVariables Base variables
   * @returns Merged variables
   */
  merge(baseVariables: Variables): IVariablesContainer;
}

/**
 * Updates number of the step which is been executed
 * @param variables Variables list
 * @param num New step number
 */
export const updateStepNumber = (
  variables: IVariablesContainer,
  num: number | string,
): void => {
  variables.put(TASK_STEP_NUMBER, num);
};

/**
 * Gets current number of the step which is been executed
 * @param variables Variables list
 * @returns Current step number
 */
export const getCurrentStepNumber = (
  variables: IVariablesContainer,
): number | string => variables.get(TASK_STEP_NUMBER);

/** Describes a factory to create the variables container */
export interface IVariablesContainerFactory {
  /**
   * Creates a new variables container
   * @param state Current state
   * @param variables Additional variables
   * @returns Variables container
   */
  createVariabesContainer(
    state: IState,
    variables?: Variables,
  ): IVariablesContainer;
}

/** Token for variables container */
export const VariablesContainerFactoryInjectionToken =
  'VariablesContainerFactory';
