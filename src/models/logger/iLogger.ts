/**
 * Describes a logger
 */
export interface ILogger {
    /**
     * Writes an informational message
     * @param message Message
     */
    info(message: string): void;
    /**
     * Writes a warning message
     * @param message Message
     */
    warning(message: string): void;

    /**
     * Writes an error message
     * @param message Message
     */
    error(message: string): void;
}
