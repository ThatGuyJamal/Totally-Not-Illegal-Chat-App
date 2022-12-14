"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPathTest = exports.testPath = void 0;
const node_path_1 = __importDefault(require("node:path"));
/**
 * A function to test paths for folders
 * @param _path of the file to find.
 * @param extraDir
 */
function testPath(_path, extraDir) {
    if (extraDir) {
        console.log(node_path_1.default.join(_path, extraDir));
    }
    else {
        console.log(node_path_1.default.join(__dirname, _path));
    }
}
exports.testPath = testPath;
function runPathTest() {
    testPath("../../validations", "syntax");
}
exports.runPathTest = runPathTest;
//# sourceMappingURL=index.js.map