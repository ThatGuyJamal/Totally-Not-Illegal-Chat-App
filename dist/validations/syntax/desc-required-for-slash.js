"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const typings_1 = require("../../typings");
exports.default = (command) => {
    const { commandName, commandObject } = command;
    if (commandObject.type === typings_1.CommandType.SLASH ||
        commandObject.type === typings_1.CommandType.BOTH) {
        if (!commandObject.description) {
            throw new Error(`Command "${commandName}" is a slash command but does not have a description`);
        }
    }
};
//# sourceMappingURL=desc-required-for-slash.js.map