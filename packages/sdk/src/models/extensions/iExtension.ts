/** Built-in extension types */
export enum ExtensionTypes {
    /** Extension that provides additional actions */
    Action = 'actions',
}

/** Union type for built-in and custom extension types */
export type ExtensionType = ExtensionTypes | string;

/** Base class for the extension */
export abstract class IExtension {
    /** Gets the name of the extension */
    public abstract get name(): string;

    /** Gets the type of the extension */
    public abstract get type(): ExtensionType

    /** Gets the priority of the extension. Extensions with higher priority will be executed first */
    public abstract get priority(): number;
} 