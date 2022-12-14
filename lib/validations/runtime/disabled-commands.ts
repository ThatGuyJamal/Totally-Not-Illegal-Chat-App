import { CommandUsage } from "../../typings/index.js";
import Command from "../../classes/cmd/Command.js";

export default async (command: Command, usage: CommandUsage) => {
  const { commandName, instance } = command;
  const { guild, message, interaction } = usage;

  if (!guild || !instance.isConnectedToDB) {
    return true;
  }

  if (
    instance.commandHandler.disabledCommands.isDisabled(guild.id, commandName)
  ) {
    const text = "This command is disabled";

    if (message) message.channel.send(text);
    else if (interaction) interaction.reply(text);

    return false;
  }

  return true;
};
