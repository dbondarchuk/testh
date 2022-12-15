/**
 * Describes an error on missed property
 */
export class PropertyIsRequiredException extends Error {
  /**
   * Creates a new instance
   * @param propertyName Name of the property
   */
  constructor(propertyName: string) {
    super(`Property '${propertyName}' is required`);
  }
}
