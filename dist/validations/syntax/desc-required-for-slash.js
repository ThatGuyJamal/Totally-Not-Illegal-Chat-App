import { CommandType } from "../../typings/index.js";
export default (command) => {
    const { commandName, commandObject } = command;
    if (commandObject.type === CommandType.SLASH ||
        commandObject.type === CommandType.BOTH) {
        if (!commandObject.description) {
            throw new Error(`Command "${commandName}" is a slash command but does not have a description`);
        }
    }
};
