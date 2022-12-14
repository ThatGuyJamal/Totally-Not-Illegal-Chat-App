"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const typings_1 = require("../../../typings");
exports.default = {
    description: "Sets the prefix for this server",
    minArgs: 1,
    syntaxError: "Correct syntax: {PREFIX}prefix {ARGS}",
    expectedArgs: "<prefix>",
    type: typings_1.CommandType.BOTH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    callback: (commandUsage) => {
        const { instance, guild, text: prefix } = commandUsage;
        if (!instance.isConnectedToDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        instance.commandHandler.prefixHandler.set(guild.id, prefix);
        return {
            content: `Set "${prefix}" as the command prefix for this server.`,
            ephemeral: true,
        };
    },
};
