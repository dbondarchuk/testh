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
  CWD,
  getCurrentStepNumber,
  IPropertiesEvaluator,
  IState,
  IStepsRunner,
  IVariablesContainer,
  IVariablesContainerFactory,
  PropertiesEvaluatorInjectionToken,
  RUN,
  Service,
  StepsRunnerInjectionToken,
  stepsWrapper,
  TASK_EXECUTION_TIME,
  TASK_START_TIME,
  TASK_TEST_NAME,
  TestStep,
  Variables,
  VariablesContainerFactoryInjectionToken,
} from '@testh/sdk';

/**
 * Contains variables for the current run
 */
export class VariablesContainer implements IVariablesContainer {
  private _variables: Variables = {};

  /**
   * Creates new instance of Variables
   * @param state Reference to the current run state
   * @param variables Initial variables
   */
  public constructor(
    private readonly state: IState,
    private readonly stepRunner: IStepsRunner,
    private readonly propertiesEvaluator: IPropertiesEvaluator,
    variables?: Variables,
  ) {
    this.initVariables(variables);
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
    const merged = new VariablesContainer(
      this.state,
      this.stepRunner,
      this.propertiesEvaluator,
    );
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

  /**
   * Evaluates variable values, using current variables
   * This allows usage of references to variables inside the variable
   */
  public async evalVariables(): Promise<void> {
    for (const key in this._variables) {
      if (!this._variables[key]) continue;

      this._variables[key] = await this.propertiesEvaluator.evaluateProperties(
        this._variables[key],
        this._variables,
      );
    }
  }

  private initVariables(variables?: Variables): void {
    // add environment vars
    Object.keys(env).forEach((key) => this.put(key, env[key]));

    this.put(CWD, process.cwd());

    this.initAgentVariables();
    this.initRunCommand();

    this.put(TASK_TEST_NAME, this.state.test.name);
    this.put(TASK_START_TIME, Date.now());
    this.put(TASK_EXECUTION_TIME, () => {
      return Date.now() - this.get(TASK_START_TIME);
    });

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
        const step: TestStep = {
          name: `Execute ${stepType}`,
          type: stepType,
          values: properties,
        };

        const currentStep = getCurrentStepNumber(this).toString();

        const results = await this.stepRunner.runTestSteps(
          stepsWrapper([step]),
          this.state,
          (stepNumber) => `${currentStep}.${stepNumber}`,
        );

        return results[results.length - 1];
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

/** Default factory for the variables container */
@Service(VariablesContainerFactoryInjectionToken)
export class VariablesContainerFactory implements IVariablesContainerFactory {
  constructor(
    @inject(StepsRunnerInjectionToken)
    private readonly stepsRunner: IStepsRunner,
    @inject(PropertiesEvaluatorInjectionToken)
    private readonly propertiesEvaluator: IPropertiesEvaluator,
  ) {}

  /** @inheritdoc */
  createVariablesContainer(
    state: IState,
    variables?: Variables,
  ): IVariablesContainer {
    const container = new VariablesContainer(
      state,
      this.stepsRunner,
      this.propertiesEvaluator,
      variables,
    );

    return container;
  }
}
