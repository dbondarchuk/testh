/** Describes an error which happens on failed assertion */
export class AssertionException extends Error {
  /**
   * Creates new instance
   * @param message Error message
   * @param _initialError Initial cause of the error
   */
  constructor(message: string, private readonly _initialError?: Error) {
    super(message);
  }

  /**
   * Initial cause of the error
   */
  public get initialError(): Error {
    return this._initialError;
  }
}
