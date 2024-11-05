import * as fs from "fs";
import * as path from "path";
import { handleError } from "./error-utils";

export function getSubdirectories(dir: string): string[] {
  try {
    return fs
      .readdirSync(dir, { withFileTypes: true })
      .filter(
        (dirent) => dirent.isDirectory() && dirent.name.match(/^order_\d+$/),
      )
      .map((dirent) => dirent.name);
  } catch (error: unknown) {
    handleError(error, `Error reading subdirectories in ${dir}`);
    return [];
  }
}

export function* readAllFiles(dir: string): Generator<string> {
  try {
    const files = fs.readdirSync(dir, { withFileTypes: true });
    for (const file of files) {
      if (file.isDirectory()) {
        yield* readAllFiles(path.join(dir, file.name));
      } else {
        if (!file.name.match(".DS_Store")) {
          yield path.join(dir, file.name);
        }
      }
    }
    return files;
  } catch (error: unknown) {
    handleError(error, `Error reading files in ${dir}`);
    return [];
  }
}

export function loadItemList(dir: string) {
  const itemsList = [];
  for (const filePath of readAllFiles(dir)) {
    try {
      const fileName = path.basename(filePath);

      // check file pattern 'item_x'
      if (!fileName.match(/^item_\d+\.json$/)) {
        console.warn(
          `Skipping file ${filePath} as it does not match the expected naming pattern.`,
        );
        continue;
      }

      const loadedItem = fs.readFileSync(filePath, "utf-8");
      const item = JSON.parse(loadedItem);
      itemsList.push(item);
    } catch (error: unknown) {
      handleError(error, `Error processing file ${filePath}`);
    }
  }
  return itemsList;
}
