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

export class InputTextTestStepRunnerProperties
    implements ITestStepRunnerProperties
{
    @Type(() => Selector)
    selector: Selector;

    text?: string;
    clear?: boolean;
}

/**
 * Clicks on a web element
 */
@Register(InputTextTestStepRunnerProperties, 'input', 'type')
export class InputTextTestStepRunner extends ITestStepRunner<InputTextTestStepRunnerProperties> {
    private readonly logger: ILogger;
    constructor(
        props: InputTextTestStepRunnerProperties,
        loggerFactory: ILoggerFactory,
    ) {
        super(props);
        this.logger = loggerFactory.get<InputTextTestStepRunner>(
            InputTextTestStepRunner,
        );
    }

    public async run(state: TestRunState): Promise<void> {
        const selector = this.props.selector;
        if (!selector) {
            throw new PropertyIsRequiredException('selector');
        }

        const element = await state.currentDriver.findElement(selector.by);

        if (this.props.clear) {
            this.logger.info(`Clearing input ${selector}`);
            await element.clear();

            this.logger.info(`Succesfully cleared element ${selector}`);
        }

        if (this.props.text) {
            this.logger.info(`Typing ${this.props.text} into ${selector}`);
            await element.sendKeys(this.props.text);
            this.logger.info(`Succesfully typed into element ${selector}`);
        }
    }
}
