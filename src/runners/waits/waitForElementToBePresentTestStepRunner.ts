import { until } from 'selenium-webdriver';
import { PropertyIsRequiredException } from '../../models/exceptions/propertyIsRequiredException';
import { TestRunState } from '../../models/runners/testRunState';
import {
    ITestStepRunner,
    ITestStepRunnerProperties,
} from '../../models/runners/iTestStepRunner';
import { Register } from '../../models/runners/testStepRunnerRegistry';
import { ILogger } from '../../models/logger/iLogger';
import { ILoggerFactory } from '../../models/logger/iLoggerFactory';
import { Selector } from '../../models/selector/selector';
import { Type } from 'class-transformer';

export class WaitForElementToBePresentTestStepRunnerProperties
    implements ITestStepRunnerProperties
{
    @Type(() => Selector)
    selector: Selector;
    timeout: number;
}

/**
 * Waits for a web element to be present
 */
@Register(
    WaitForElementToBePresentTestStepRunnerProperties,
    'wait',
    'wait-to-be-present',
    'wait-to-be-visible',
)
export class WaitForElementToBePresentTestStepRunner extends ITestStepRunner<WaitForElementToBePresentTestStepRunnerProperties> {
    private readonly logger: ILogger;
    constructor(
        props: WaitForElementToBePresentTestStepRunnerProperties,
        loggerFactory: ILoggerFactory,
    ) {
        super(props);
        this.logger =
            loggerFactory.get<WaitForElementToBePresentTestStepRunner>(
                WaitForElementToBePresentTestStepRunner,
            );
    }

    public async run(state: TestRunState): Promise<void> {
        const selector = this.props.selector;
        const timeout = this.props.timeout ?? 5;
        if (!selector) {
            throw new PropertyIsRequiredException('selector');
        }

        this.logger.info(
            `Waiting for element ${selector} to be present and visible for ${timeout} seconds.`,
        );

        await state.currentDriver.wait(
            until.elementLocated(selector.by),
            timeout * 1000,
            `Element ${selector} wasn't present for ${timeout} seconds`,
        );

        this.logger.info(`Element ${selector} was sucessfully located`);
    }
}
