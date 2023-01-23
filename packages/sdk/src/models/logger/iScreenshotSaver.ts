import { IState, TestStep } from '../tests';

/** Describes a service that saves screenshots  */
export interface IScreenshotSaver {
  /**
   * Saves screenshot
   * @param data Base64 representation of image.
   * @param step Current step
   * @param state Current state
   */
  save(data: string, step: TestStep, state: IState): Promise<void>;
}

/** Injection token for screenshot saver service */
export const ScreenshotSaverInjectionToken = 'ScreenshotSaver';
