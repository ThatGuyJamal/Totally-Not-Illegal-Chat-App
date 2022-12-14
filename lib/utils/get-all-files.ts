import fs from "fs";
import _path from "path";

import { FileData } from "../typings/index.js";

const getAllFiles = async (path: string, foldersOnly = false) => {
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
        filesFound = [...filesFound, ...(await getAllFiles(filePath))];
      }
      continue;
    }

    const fileContents = await import(filePath);

    filesFound.push({
      filePath,
      fileContents: fileContents?.default || fileContents,
    });
  }

  return filesFound;
};

export default getAllFiles;
