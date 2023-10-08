import {
  getCurrentStepNumber,
  ILogger,
  ILoggerFactory,
  IScreenshotCallback,
  IState,
  LoggerFactoryInjectionToken,
  ScreenshotCallbackInjectionToken,
  Service,
  Settings,
  SettingsInjectionToken,
  TestStep,
} from '@testh/sdk';

import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { inject } from 'tsyringe';

/** Saves screenshot to a file */
@Service(ScreenshotCallbackInjectionToken)
export class FileScreenshotCallback implements IScreenshotCallback {
  private readonly logger: ILogger;

  constructor(
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
    @inject(SettingsInjectionToken) private readonly settings: Settings,
  ) {
    this.logger = loggerFactory.get<FileScreenshotCallback>(
      FileScreenshotCallback,
    );
  }

  async save(
    data: string,
    step: TestStep,
    state: IState,
    _: string,
    fileNameSuffix?: string,
  ): Promise<void> {
    const screenshotDirectory =
      this.settings?.screenshots?.file?.directory || 'screenshots';

    const screenshotPath = `${screenshotDirectory}/${
      state.test.name
    }-${getCurrentStepNumber(state.variables)}-${step.name}${
      fileNameSuffix ? '-' + fileNameSuffix : ''
    }.png`;

    await mkdir(dirname(screenshotPath), { recursive: true });
    await writeFile(
      screenshotPath,
      data.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );

    this.logger.info(`Successfully saved screenshot to '${screenshotPath}'`);
  }
}
