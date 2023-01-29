import { lstat, readdir } from 'fs/promises';
import * as p from 'path';

/**
 * Recursively gets files from path
 * @param path Path to read
 * @param recursive Determines whether to get files recursively. @defaultValue `true`
 * @returns List of files
 */
export async function recursiveReaddirAsync(
  path: string,
  recursive = true,
): Promise<string[]> {
  const items = await readdir(path);
  const promises = items.map(async (file) => {
    const stats = await lstat(p.join(path, file));
    if (recursive && stats.isDirectory()) {
      return await recursiveReaddirAsync(p.join(path, file));
    } else {
      return [p.join(path, file)];
    }
  });

  return (await Promise.all(promises)).flat();
}

/**
 * Dynamically imports files from the directory based on file extension
 * @param fileExtensions File extensions to look for
 * @param directory Path to the directory where to look for the files
 * @param recursive Determines whether to get files recursively. @defaultValue `true`
 */
export async function loadAsync(
  fileExtensions: string | string[],
  directory: string,
  recursive = true,
): Promise<void> {
  const extensions =
    typeof fileExtensions === 'string' ? [fileExtensions] : fileExtensions;
  const files = (await recursiveReaddirAsync(directory, recursive)).filter(
    (file) => extensions.some((fileExtension) => file.endsWith(fileExtension)),
  );
  const promises = files.map((file) => import(file));

  await Promise.all(promises);
}
