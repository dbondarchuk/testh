import { TestRunState } from './testRunState';
import { TestStep } from '../tests/testStep';

/**
 * Base type for test step runner properties
 */
export type ITestStepRunnerProperties = Record<string, any>;

/**
 * Base class for the test step runners
 */
export abstract class ITestStepRunner<Props extends ITestStepRunnerProperties> {
    /**
     * @param props Properties
     */
    constructor(protected readonly props: Props) {}

    /**
     * Test step entry point
     * @param state Current state
     * @param step Test step
     */
    public abstract run(state: TestRunState, step: TestStep): Promise<void>;
}
