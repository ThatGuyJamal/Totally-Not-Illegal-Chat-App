import { CommandUsage } from "../../typings";
import Command from "../../classes/cmd/Command";

export default (command: Command, usage: CommandUsage): boolean => {
  const { instance, commandObject } = command;
  const { guild } = usage;

  if (commandObject.testOnly !== true) {
    return true;
  }

  return instance.testServers.includes(guild?.id || "");
};
