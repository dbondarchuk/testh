import * as fs from 'fs';
import * as p from 'path';
import * as yaml from 'js-yaml';
import * as yi from './index'

function construct(data) {
  const basePath = yi.getBasePath();
  const fullPath = p.join(basePath, data);

  yi.setBaseFile(fullPath);

  console.debug('basePath %s', basePath);
  console.debug('resolved %s', fullPath);
  console.debug('incoming data %s', data);

  const src = fs.readFileSync(fullPath, 'utf8');
  const included = yaml.load(src, {
    schema: yi.YAML_INCLUDE_SCHEMA,
    filename: fullPath
  });

  yi.setBaseFile(basePath);

  return included;
}

function resolve(data: any) {
  console.debug('in resolve');
  console.debug('data %s', data);
  return (typeof data === 'string');
}

export const YamlIncludeFileType = new yaml.Type('tag:yaml.org,2002:inc/file', {
  kind: 'scalar',
  resolve: resolve,
  construct: construct
});