import * as fs from 'fs';
import * as p from 'path';

function recursiveReaddirSync(path: string, recursive = true): string[] {
    let list: string[] = [];
    const files = fs.readdirSync(path);
  
    files.forEach(function (file) {
      const stats = fs.lstatSync(p.join(path, file));
      if (recursive && stats.isDirectory()) {
        list = list.concat(recursiveReaddirSync(p.join(path, file)));
      } else {
        list.push(p.join(path, file));
      }
    });
  
    return list;
  }

const promises = recursiveReaddirSync(__dirname)
    .filter(file => file.endsWith('.action.js'))
    .map(file => {
        return import(file)
    });

Promise.all(promises);