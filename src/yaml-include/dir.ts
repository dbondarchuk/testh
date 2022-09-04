import * as fs from 'fs';
import * as p from 'path';
import * as yaml from 'js-yaml';
import * as yi from './index';

import * as merge from 'lodash.merge';

export interface IncludeDirOptions {
    whitelist?: string[],
    blacklist?: string[],
    allowEmpty?: boolean,
    recursive?: boolean,
    extensions?: string[],
    lowerKeys?: boolean,
    ignoreIndicator?: string,
    ignoreTopLevelDir?: boolean,
    ignoreDirStructure?: boolean,
    treatAllDotsAsExtension?: boolean,
    excludeTopLevelDirSeparator?: boolean,
    pathSeparator?: string;
}

export const DefaultIncludeDirOptions: IncludeDirOptions = {
    whitelist: [],
    blacklist: [],
    allowEmpty: false,
    recursive: true,
    extensions: ['.yaml', '.yml'],
    lowerKeys: false,
    ignoreIndicator: '_',
    ignoreTopLevelDir: true,
    ignoreDirStructure: true,
    treatAllDotsAsExtension: true,
    excludeTopLevelDirSeparator: true,
    pathSeparator: '_'
};

function recursiveReaddirSync(path: string): string[] {
    let list: string[] = [];
    const files = fs.readdirSync(path);
  
    files.forEach(function (file) {
      const stats = fs.lstatSync(p.join(path, file));
      if(stats.isDirectory()) {
        list = list.concat(recursiveReaddirSync(p.join(path, file)));
      } else {
        list.push(p.join(path, file));
      }
    });
  
    return list;
  }

function constructIncludedDirectory(data) {
    const basePath = yi.getBasePath();

    let files: string[] = [];

    let work = {};
    let opt: IncludeDirOptions = {};

    if (Array.isArray(data[0])) {
        files = data[0];
    } else {
        const fullPath = p.join(basePath, data[0]);
        console.debug('reading %s', fullPath);
        files = recursiveReaddirSync(fullPath);
        files = files.map(filePath => filePath.replace(basePath + p.sep, ''));

        console.debug('files ', files);
    }

    // sort the by length of filepath
    files.sort(function (a, b) {
        return a.length - b.length;
    });

    if (!data[1]) {
        data[1] = {};
    }

    opt = {...DefaultIncludeDirOptions, ...opt, ...data[1]};

    console.debug('resolved options %j', opt);

    const hasToKeepFile = (filePath: string): string | undefined => {
        let ext = p.extname(filePath);
        if (opt.treatAllDotsAsExtension) {
            ext = '.' + p.basename(filePath).split('.').slice(1).join('.');
        }

        if (opt.extensions.indexOf(ext) === -1) {
            console.debug('skipping disallowed file extension %s: %s', ext, filePath);
            return undefined;
        }

        const filename = p.basename(filePath, ext);

        // check whitelist for filepath and file name
        if (opt.whitelist.indexOf(filePath) !== -1 ||
            opt.whitelist.indexOf(filename) !== -1 ||
            opt.whitelist.indexOf(filename + ext) !== -1) {
            console.debug('whitelisting %s', filePath);
            return filename;
        }

        // if ANY part of the path has an ignorePrefix,
        // skip it
        if (filePath.indexOf(p.sep + opt.ignoreIndicator) !== -1) {
            console.debug('ignoring %s', filePath);
            return undefined;
        }

        // check blacklist for filepath and file name
        if (opt.blacklist.indexOf(filePath) !== -1 ||
            opt.blacklist.indexOf(filename) !== -1 ||
            opt.blacklist.indexOf(filename + ext) !== -1) {
            console.debug('blacklisting %s', filePath);
            return undefined;
        }

        // guess we're keeping it!
        console.debug('keepFile: keeping ' + filePath);
        
        return filename;
    };

    files.forEach(function (filePath: string) {
        console.debug('looking at %s', filePath);

        const filename = hasToKeepFile(filePath)
        if (!filename) {
            return;
        }

        const splitDirPath = filePath.split(p.sep);
        splitDirPath.pop();

        // we generally don't want the top dir.
        if (opt.ignoreTopLevelDir) {
            splitDirPath.shift();
        }

        if (opt.lowerKeys) {
            filePath = filePath.toLowerCase();
        }

        // get the source at last
        let included = {};
        const fullFilePath = p.join(basePath, filePath);
        const src = fs.readFileSync(fullFilePath, 'utf8');
        if (src.length > 0) {
            yi.setBaseFile(fullFilePath);
            included = yaml.load(src, {
                schema: yi.YAML_INCLUDE_SCHEMA,
                filename: filePath
            });

            yi.setBaseFile(basePath);
        }

        const tmp = {};
        if (opt.recursive) {
            let key = opt.excludeTopLevelDirSeparator ? '' : opt.pathSeparator;
            key += splitDirPath.join(opt.pathSeparator);
            if (opt.allowEmpty) {
                tmp[key] = {};
                tmp[key][filename] = included;
            } else {
                if (Object.getOwnPropertyNames(included).length > 0) {
                    if (key.length > 0 && !opt.ignoreDirStructure) {
                        tmp[key] = {};
                        tmp[key][filename] = included;
                    } else {
                        // this implements the opt.excludeTopLevelDirSeparator option when at the top level
                        tmp[filename] = included;
                    }
                }
            }
        } else {
            if (opt.allowEmpty) {
                tmp[filename] = included;
            } else {
                if (Object.getOwnPropertyNames(included).length > 0) {
                    tmp[filename] = included;
                }
            }
        }

        work = merge(work, tmp);
    });

    return work;
}

/**
 * Since this is a sequence type, `data` must be an array
 */
function resolveIncludedDirectory(data) {
    return Array.isArray(data) && data.length > 0 && data.length < 3;
}

export const YamlIncludeDirType = new yaml.Type('tag:yaml.org,2002:inc/dir', {
    kind: 'sequence',
    resolve: resolveIncludedDirectory,
    construct: constructIncludedDirectory,
    instanceOf: Object
});