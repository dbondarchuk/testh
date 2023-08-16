/**
 * Type alias for usage of types between test steps to prevent them from class-transformer
 */
export type Safe<T> = () => T;
