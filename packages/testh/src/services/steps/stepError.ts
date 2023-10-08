/** Incapsulates an error for the failed test step */
export class StepError extends Error {
  public constructor(
    /** Step number */
    public readonly stepNumber: string | number,

    /** Name of the step */
    public readonly stepName: string,

    /** Original error that produced this error */
    public readonly originalError: Error,
  ) {
    super(`Step #${stepNumber} ${stepName} has failed: ${originalError}`);
  }
}
