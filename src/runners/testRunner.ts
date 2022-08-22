import { LoggerFactory } from '../logger/loggerFactory';
import { TestRunState } from '../models/runners/testRunState';
import { getImplementations } from '../models/runners/testStepRunnerRegistry';
import { Test } from '../models/tests/test';
import { updateStepNumber } from '../models/tests/variables';

import { plainToClass } from 'class-transformer';

import 'reflect-metadata';
import './runners';
import { getProperties } from '../models/tests/testStep';

export class TestRunner {
    protected readonly state: TestRunState;

    constructor(protected readonly test: Test) {
        this.state = new TestRunState(test);
    }

    public async run(): Promise<boolean> {
        const loggerFactory = new LoggerFactory();
        const logger = loggerFactory.get<TestRunner>(TestRunner);

        logger.info(`Running a test '${this.test.name}'...`);

        let isFailed = false;
        let error: Error = undefined;
        let stepNumber = 1;
        for (const step of this.test.steps) {
            updateStepNumber(this.state.variables, stepNumber++);

            if (step.disabled) {
                logger.info(`Step '${step.name}' is disabled. Skipping it.`);
                continue;
            }

            if (!step.runOnFailure && isFailed) continue;

            logger.info(`Running a step '${step.name}'`);

            const runners = getImplementations();

            const runnerType = runners[step.type];
            if (!runnerType) {
                isFailed = true;
                error = new Error(
                    `Can't find a runner of type '${step.type}'.`,
                );

                break;
            }

            const props = plainToClass(
                runnerType.propertiesType,
                getProperties(step, this.state.variables),
            );

            const runner = new runnerType.ctor(props, loggerFactory);

            try {
                await runner.run(this.state, step);
            } catch (e) {
                isFailed = !isFailed && !step.ignoreError;
                error = e;
            }
        }

        await this.state.removeAllDrivers();

        if (isFailed) {
            logger.error(`Test execution failed: ${error}`);
            return false;
        }

        return true;
    }
}
