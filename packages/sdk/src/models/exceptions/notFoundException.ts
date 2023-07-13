/**
 * Describes an error on not found item
 */
export class NotFoundException extends Error {
  /**
   * Creates a new instance
   */
  constructor(message: string) {
    super(message);
  }
}
