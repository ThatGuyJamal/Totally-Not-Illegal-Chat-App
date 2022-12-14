"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const enums_1 = require("../../../typings/enums");
exports.default = (command) => {
    const { commandName, commandObject } = command;
    if (commandObject.type === enums_1.CommandType.SLASH ||
        commandObject.type === enums_1.CommandType.BOTH) {
        if (!commandObject.description) {
            throw new Error(`Command "${commandName}" is a slash command but does not have a description`);
        }
    }
};
