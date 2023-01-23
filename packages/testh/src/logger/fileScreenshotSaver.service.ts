import {
  getCurrentStepNumber,
  ILogger,
  ILoggerFactory,
  IScreenshotSaver,
  IState,
  LoggerFactoryInjectionToken,
  ScreenshotSaverInjectionToken,
  Service,
  Settings,
  SettingsInjectionToken,
  TestStep,
} from '@testh/sdk';

import { mkdir, writeFile } from 'fs/promises';
import { dirname } from 'path';
import { inject } from 'tsyringe';

/** Saves screenshot to a file */
@Service(ScreenshotSaverInjectionToken)
export class FileScreenshotSaver implements IScreenshotSaver {
  private readonly logger: ILogger;

  constructor(
    @inject(LoggerFactoryInjectionToken) loggerFactory: ILoggerFactory,
    @inject(SettingsInjectionToken) private readonly settings: Settings,
  ) {
    this.logger = loggerFactory.get<FileScreenshotSaver>(FileScreenshotSaver);
  }

  async save(data: string, step: TestStep, state: IState): Promise<void> {
    const screenshotDirectory =
      this.settings?.screenshots?.file?.directory || 'screenshots';

    const screenshotPath = `${screenshotDirectory}/${
      state.test.name
    }-${getCurrentStepNumber(state.variables)}-${step.name}.png`;

    await mkdir(dirname(screenshotPath), { recursive: true });
    await writeFile(
      screenshotPath,
      data.replace(/^data:image\/png;base64,/, ''),
      'base64',
    );

    this.logger.info(`Successfully saved screenshot to '${screenshotPath}'`);
  }
}
