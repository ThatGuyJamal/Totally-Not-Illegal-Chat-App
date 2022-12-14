import { CommandType } from "../../typings/index.js";
import Command from "../../classes/cmd/Command.js";

export default (command: Command) => {
  const { commandName, commandObject } = command;

  if (
    commandObject.type === CommandType.SLASH ||
    commandObject.type === CommandType.BOTH
  ) {
    if (!commandObject.description) {
      throw new Error(
        `Command "${commandName}" is a slash command but does not have a description`
      );
    }
  }
};
