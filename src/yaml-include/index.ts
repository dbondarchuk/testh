import { statSync } from 'fs';
import * as yaml from 'js-yaml';
import * as p from 'path';
import { YamlIncludeDirType } from './dir';
import { YamlIncludeFileType } from './file';

export const YAML_TYPES = [YamlIncludeDirType, YamlIncludeFileType];
export const YAML_INCLUDE_SCHEMA = new yaml.Schema(YAML_TYPES);

let baseFile = '';

// so we know where to find files referenced relative to the base file
export function setBaseFile(filePath: string): void {
    baseFile = p.resolve(filePath);
    console.debug(`Setting base file ${baseFile}`);
}

export function getBasePath(): string {
    const dir = statSync(baseFile).isDirectory() ? baseFile : p.dirname(baseFile);

    console.debug(`Getting base path ${dir}`);
    return dir;
}