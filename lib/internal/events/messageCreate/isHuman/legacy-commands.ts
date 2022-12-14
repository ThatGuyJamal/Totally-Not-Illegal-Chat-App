import type { Message } from "discord.js";

import ACH from "../../../../main";

export default async (message: Message, instance: ACH) => {
  const { guild, content } = message;

  const { commandHandler } = instance;

  if (!commandHandler) return;

  const { prefixHandler, commands, customCommands } = commandHandler;

  const prefix = prefixHandler.get(guild?.id);

  // If the message doesn't start with the prefix, do nothing
  if (!content.startsWith(prefix)) return;

  const args = content.split(/\s+/);
  const commandName = args.shift()!.substring(prefix.length).toLowerCase();

  const command = commands.get(commandName);

  // If the command doesn't exist, do nothing
  if (!command) return await customCommands.run(commandName, message, null);

  const { reply, deferReply } = command.commandObject;

  if (deferReply) {
    await message.channel.sendTyping();
  }

  const response = await commandHandler.runCommand(
    command,
    args,
    message,
    null
  );

  if (!response) return;

  if (reply) {
    message.reply(response).catch(() => {});
  } else {
    message.channel.send(response).catch(() => {});
  }
};
