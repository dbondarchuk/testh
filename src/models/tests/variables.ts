import { env } from 'process';
import * as os from 'os';
import { JsEngine } from '../../helpers/js/jsEngine';

import { version } from '../../../package.json';

/**
 * Contains variables for the current run
 */
export class Variables {
    public static readonly AGENT_PREFIX = 'Agent_';
    public static readonly TASK_PREFIX = 'Task_';
    public static readonly BROWSER_PREFIX = 'Browser_';
    public static readonly API_PREFIX = 'Api_';

    public static readonly TASK_TASK_ID = Variables.TASK_PREFIX + 'TaskId';
    public static readonly TASK_TEST_ID = Variables.TASK_PREFIX + 'TestId';
    public static readonly TASK_TEST_NAME = Variables.TASK_PREFIX + 'TestName';
    public static readonly TASK_IS_MONITORING =
        Variables.TASK_PREFIX + 'IsMonitoring';
    public static readonly TASK_STEP_NUMBER =
        Variables.TASK_PREFIX + 'StepNumber';
    public static readonly TASK_STEPS_DONE =
        Variables.TASK_PREFIX + 'StepsDone';
    public static readonly TASK_TOTAL_STEPS =
        Variables.TASK_PREFIX + 'TotalSteps';

    public static readonly AGENT_IP_ADDRESS =
        Variables.AGENT_PREFIX + 'IpAddress';
    public static readonly AGENT_HOST_NAME =
        Variables.AGENT_PREFIX + 'HostName';
    public static readonly AGENT_OS_NAME = Variables.AGENT_PREFIX + 'OsName';
    public static readonly AGENT_OS_VERSION =
        Variables.AGENT_PREFIX + 'OsVersion';
    public static readonly AGENT_ARCHITECTURE =
        Variables.AGENT_PREFIX + 'Architecture';
    public static readonly AGENT_VERSION = Variables.AGENT_PREFIX + 'Version';

    public static readonly BROWSER_LAST_LOAD_TIME =
        Variables.BROWSER_PREFIX + 'LastLoadTime';
    public static readonly BROWSER_LOAD_TIMES =
        Variables.BROWSER_PREFIX + 'LoadTimes';

    public static readonly API_LOAD_TIMES = Variables.API_PREFIX + 'LoadTimes';

    private readonly _variables: Record<string, any> = {};

    /**
     * Creates new instance of Variables
     * @param variables Initial variables
     */
    public constructor(variables?: Record<string, any>) {
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
    public get variables(): Record<string, any> {
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
        key = Variables.fixVariableName(key);
        this._variables[key] = value;

        return key;
    }

    private initVariables(variables?: Record<string, any>): void {
        // add environment vars
        Object.keys(env).forEach((key) => this.put(key, env[key]));

        this.initAgentVariables();

        if (variables) {
            Object.keys(variables).forEach((key) =>
                this.put(key, variables[key]),
            );
        }
    }

    private initAgentVariables(): void {
        this.put(Variables.AGENT_IP_ADDRESS, Variables.getIpAddress());
        this.put(Variables.AGENT_HOST_NAME, os.hostname());
        this.put(Variables.AGENT_OS_NAME, os.platform());
        this.put(Variables.AGENT_OS_VERSION, os.version());
        this.put(Variables.AGENT_ARCHITECTURE, os.arch());
        this.put(Variables.AGENT_VERSION, version);
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
export const updateStepNumber = (variables: Variables, num: number): void => {
    variables.put(Variables.TASK_PREFIX + 'StepNumber', num);
};
