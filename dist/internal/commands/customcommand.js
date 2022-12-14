"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const typings_1 = require("../../typings");
const noCommands = "No custom commands configured.";
exports.default = {
    description: "Creates a custom command",
    type: typings_1.CommandType.SLASH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "create",
            description: "Creates a custom command",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "command",
                    description: "The name of the command",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "description",
                    description: "The description of the command",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
                {
                    name: "response",
                    description: "The response of the command",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                },
            ],
        },
        {
            name: "delete",
            description: "Deletes a custom command",
            type: discord_js_1.ApplicationCommandOptionType.Subcommand,
            options: [
                {
                    name: "command",
                    description: "The name of the command",
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: true,
                    autocomplete: true,
                },
            ],
        },
    ],
    autocomplete: (command, _, interaction) => {
        const results = [
            ...command.instance.commandHandler.customCommands.getCommands(interaction.guild.id),
        ];
        if (results.length === 0) {
            results.push(noCommands);
        }
        return results;
    },
    callback: async (commandUsage) => {
        const { instance, guild } = commandUsage;
        const interaction = commandUsage.interaction;
        if (!instance.isConnectedToDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const sub = interaction.options.getSubcommand();
        if (sub === "create") {
            const commandName = interaction.options.getString("command", true);
            const description = interaction.options.getString("description", true);
            const response = interaction.options.getString("response", true);
            await instance.commandHandler?.customCommands.create(guild.id, commandName, description, response);
            return {
                content: `Custom command "${commandName}" has been created!`,
                ephemeral: true,
            };
        }
        else if (sub === "delete") {
            const commandName = interaction.options.getString("command", true);
            if (commandName === noCommands) {
                return {
                    content: "There are no custom commands to delete.",
                    ephemeral: true,
                };
            }
            await instance.commandHandler?.customCommands.delete(guild.id, commandName);
            return {
                content: `Custom command "${commandName}" has been deleted!`,
                ephemeral: true,
            };
        }
    },
};
//# sourceMappingURL=customcommand.js.map