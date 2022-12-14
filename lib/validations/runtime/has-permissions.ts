import requiredPermissions from "../../models/required-permissions-schema.js";
import { PermissionFlagsBits } from "discord.js";
import { CommandUsage } from "../../typings/index.js";
import Command from "../../classes/cmd/Command.js";

const keys = Object.keys(PermissionFlagsBits);

export default async (command: Command, usage: CommandUsage) => {
  const { permissions = [] } = command.commandObject;
  const { instance, guild, member, message, interaction } = usage;

  if (!member || !instance.isConnectedToDB) {
    return true;
  }

  const document = await requiredPermissions.findById(
    `${guild!.id}-${command.commandName}`
  );
  if (document) {
    for (const permission of document.permissions) {
      if (!permissions.includes(permission)) {
        permissions.push(permission);
      }
    }
  }

  if (permissions.length) {
    const missingPermissions = [];

    for (const permission of permissions) {
      // @ts-ignore
      if (!member.permissions.has(permission)) {
        const permissionName = keys.find(
          // @ts-ignore
          (key) => key === permission || PermissionFlagsBits[key] === permission
        );
        missingPermissions.push(permissionName);
      }
    }

    if (missingPermissions.length) {
      const text = `You are missing the following permissions: "${missingPermissions.join(
        '", "'
      )}"`;

      if (message) message.reply(text);
      else if (interaction) interaction.reply(text);

      return false;
    }
  }

  return true;
};
