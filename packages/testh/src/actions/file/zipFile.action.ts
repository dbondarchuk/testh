import {
  Action,
  IAction,
  IActionProperties,
  ILogger,
  ILoggerFactory,
  PropertyIsRequiredException,
  Safe,
  BindingProperty,
  NotFoundException,
} from '@testh/sdk';

import * as AdmZip from 'adm-zip';

import { existsSync } from 'fs';
import * as $fs from 'fs/promises';

/**
 * Blob item
 */
export class BlobItem {
  /** Blob */
  blob: Safe<Blob>;

  /** File name.
   * Should be relative path inside the zip file
   */
  name: string;
}

/**
 * Properties for {@link ZipFileAction}
 */
export class ZipFileProperties implements IActionProperties {
  /**
   * Items to zip
   */
  @BindingProperty()
  items: Array<string | BlobItem>;
}

/** Action type aliases for {@link ZipFileAction} */
export const ZipFileActionTypeAliases = ['zip', 'zip-file'] as const;

/**
 * Zip files
 * @properties {@link ZipFileProperties}
 * @runnerType {@link ZipFileActionTypeAliases}
 * @error {@link NotFoundException} When path doesn't exist
 * @result {@link Safe<Blob>} Zip blob
 */
@Action(ZipFileProperties, 'Zip files', ...ZipFileActionTypeAliases)
export class ZipFileAction extends IAction<ZipFileProperties, Safe<Blob>> {
  private readonly logger: ILogger;
  constructor(props: ZipFileProperties, loggerFactory: ILoggerFactory) {
    super(props);
    this.logger = loggerFactory.get<ZipFileAction>(ZipFileAction);
  }

  public async run(): Promise<Safe<Blob>> {
    if (!this.props.items) {
      throw new PropertyIsRequiredException('items');
    }

    this.logger.info(`Zipping ${this.props.items.length} items`);

    const zip = new AdmZip();

    for (const item of this.props.items) {
      if (typeof item === 'string') {
        const stat = await $fs.stat(item);
        if (!existsSync(item)) {
          throw new NotFoundException(`Item path '${item}' doesn't exist`);
        }

        if (stat.isFile()) {
          zip.addLocalFile(item);
        } else {
          zip.addLocalFolder(item);
        }
      } else {
        if (!item.blob) {
          throw new PropertyIsRequiredException('Blob is required');
        }

        if (!item.name) {
          throw new PropertyIsRequiredException('Name is required');
        }

        const blob = item.blob();
        if (!blob && !blob.arrayBuffer) {
          throw new PropertyIsRequiredException('Blob is required');
        }

        const arrayBuffer = await blob.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        zip.addFile(item.name, buffer);
      }
    }

    const zipBuffer = await zip.toBufferPromise();
    const blob = new Blob([zipBuffer]);

    return () => blob;
  }
}
