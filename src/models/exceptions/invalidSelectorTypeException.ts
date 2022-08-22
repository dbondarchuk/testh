/**
 * Describes the error on incorrect selector type
 */
export class InvalidSelectorTypeException extends Error {
    /**
     * Creates a new instance
     * @param type Selector type
     */
    constructor(type: string) {
        super(`Unknown selector type -  ${type}`);
    }
}
