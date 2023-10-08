import { IState, TestStep } from '../tests';

/** Describes a service that gets a callback on a new screenshot  */
export interface IScreenshotCallback {
  /**
   * Saves screenshot
   * @param data Base64 representation of image.
   * @param step Current step
   * @param state Current state
   * @param description Description of the screenshot
   * @param fileNameSuffix Additional suffix to add to the file name
   */
  save(
    data: string,
    step: TestStep,
    state: IState,
    description: string,
    fileNameSuffix?: string,
  ): Promise<void>;
}

/** Injection token for screenshot callback service */
export const ScreenshotCallbackInjectionToken = 'ScreenshotCallback';
