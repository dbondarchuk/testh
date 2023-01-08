/** Built-in extension types */
export enum ExtensionTypes {
  /** Extension that provides additional actions */
  Action = 'actions',

  /** Extension that provides test based on arguments */
  ServiceProvider = 'service-provider',
}

/** Union type for built-in and custom extension types */
export type ExtensionType = ExtensionTypes | string;
