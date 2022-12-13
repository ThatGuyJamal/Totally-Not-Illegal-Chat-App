"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const required_roles_schema_1 = __importDefault(require("../../models/required-roles-schema"));
const CommandType_1 = __importDefault(require("../../util/CommandType"));
exports.default = {
    description: "Sets what commands require what roles",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    roles: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "command",
            description: "The command to set roles to",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "role",
            description: "The role to set for the command",
            type: discord_js_1.ApplicationCommandOptionType.Role,
            required: false,
        },
    ],
    autocomplete: (command) => {
        return [...command.instance.commandHandler.commands.keys()];
    },
    callback: async (commandUsage) => {
        const { instance, guild, args } = commandUsage;
        if (!instance.isConnectedToDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const [commandName, role] = args;
        const command = instance.commandHandler.commands.get(commandName);
        if (!command) {
            return {
                content: `The command "${commandName}" does not exist.`,
                ephemeral: true,
            };
        }
        const _id = `${guild.id}-${command.commandName}`;
        if (!role) {
            const document = await required_roles_schema_1.default.findById(_id);
            const roles = document && document.roles?.length
                ? document.roles.map((roleId) => `<@&${roleId}>`)
                : "None.";
            return {
                content: `Here are the roles for "${commandName}": ${roles}`,
                ephemeral: true,
                allowedMentions: {
                    roles: [],
                },
            };
        }
        const alreadyExists = await required_roles_schema_1.default.findOne({
            _id,
            roles: {
                $in: [role],
            },
        });
        if (alreadyExists) {
            await required_roles_schema_1.default.findOneAndUpdate({
                _id,
            }, {
                _id,
                $pull: {
                    roles: role,
                },
            });
            return {
                content: `The command "${commandName}" no longer requires the role <@&${role}>`,
                ephemeral: true,
                allowedMentions: {
                    roles: [],
                },
            };
        }
        await required_roles_schema_1.default.findOneAndUpdate({
            _id,
        }, {
            _id,
            $addToSet: {
                roles: role,
            },
        }, {
            upsert: true,
        });
        return {
            content: `The command "${commandName}" now requires the role <@&${role}>`,
            ephemeral: true,
            allowedMentions: {
                roles: [],
            },
        };
    },
};
