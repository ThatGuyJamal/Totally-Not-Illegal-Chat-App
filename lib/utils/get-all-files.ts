import fs from "fs";
import _path from "path";

import { FileData } from "../typings/index.js";

const getAllFiles = (path: string, foldersOnly = false) => {
  const files = fs.readdirSync(path, {
    withFileTypes: true,
  });
  let filesFound: FileData[] = [];

  for (const file of files) {
    const filePath = _path.join(path, file.name);

    if (file.isDirectory()) {
      if (foldersOnly) {
        filesFound.push({
          filePath,
          fileContents: file,
        });
      } else {
        filesFound = [...filesFound, ...getAllFiles(filePath)];
      }
      continue;
    }

    //
    const fileContents = import(filePath).then((fileData) => fileData);

    filesFound.push({
      filePath,
      // @ts-ignore - This is a hacky way to get the default export
      fileContents: fileContents?.default || fileContents,
    });
  }

  return filesFound;
};

export default getAllFiles;
