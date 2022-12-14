import path from "node:path";
/**
 * A function to test paths for folders
 * @param _path of the file to find.
 * @param extraDir
 */
export function testPath(_path, extraDir) {
    if (extraDir) {
        console.log(path.join(_path, extraDir));
    }
    else {
        console.log(path.join(__dirname, _path));
    }
}
export function runPathTest() {
    testPath("../../validations", "syntax");
}
