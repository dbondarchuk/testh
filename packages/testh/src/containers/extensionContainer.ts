import { ExtensionType, IExtension, IExtensionContainer } from '@testh/sdk';

/** Default implementation of the extension registry */
export class ExtensionContainer extends IExtensionContainer {
  private implementations: Record<string, IExtension[]> = {};

  /** @inheritdoc */
  public get<T extends IExtension>(type: ExtensionType): T[] {
    return (
      (this.implementations[type] as T[])
        ?.slice(0)
        .sort((a, b) => b.priority - a.priority) || []
    );
  }

  /** @inheritdoc */
  public getAll(): IExtension[] {
    return (
      Object.values(this.implementations)
        .flat()
        .slice(0)
        .sort((a, b) => b.priority - a.priority) || []
    );
  }

  /** @inheritdoc */
  public register<T extends IExtension>(extension: T): void {
    if (!this.implementations[extension.type])
      this.implementations[extension.type] = [];
    this.implementations[extension.type].push(extension);
  }
}
