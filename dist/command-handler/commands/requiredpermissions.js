"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const required_permissions_schema_1 = __importDefault(require("../../models/required-permissions-schema"));
const CommandType_1 = __importDefault(require("../../util/CommandType"));
const clearAllPermissions = "Clear All Permissions";
exports.default = {
    description: "Sets what commands require what permissions",
    type: CommandType_1.default.SLASH,
    guildOnly: true,
    permissions: [discord_js_1.PermissionFlagsBits.Administrator],
    options: [
        {
            name: "command",
            description: "The command to set permissions to",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: true,
            autocomplete: true,
        },
        {
            name: "permission",
            description: "The permission to set for the command",
            type: discord_js_1.ApplicationCommandOptionType.String,
            required: false,
            autocomplete: true,
        },
    ],
    autocomplete: (command, arg) => {
        if (arg === "command") {
            return [...command.instance.commandHandler.commands.keys()];
        }
        else if (arg === "permission") {
            return [clearAllPermissions, ...Object.keys(discord_js_1.PermissionFlagsBits)];
        }
    },
    callback: async (commandUsage) => {
        const { instance, guild, args } = commandUsage;
        if (!instance.isConnectedToDB) {
            return {
                content: "This bot is not connected to a database which is required for this command. Please contact the bot owner.",
                ephemeral: true,
            };
        }
        const [commandName, permission] = args;
        const command = instance.commandHandler.commands.get(commandName);
        if (!command) {
            return {
                content: `The command "${commandName}" does not exist.`,
                ephemeral: true,
            };
        }
        const _id = `${guild.id}-${command.commandName}`;
        if (!permission) {
            const document = await required_permissions_schema_1.default.findById(_id);
            const permissions = document && document.permissions?.length
                ? document.permissions.join(", ")
                : "None.";
            return {
                content: `Here are the permissions for "${commandName}": ${permissions}`,
                ephemeral: true,
            };
        }
        if (permission === clearAllPermissions) {
            await required_permissions_schema_1.default.deleteOne({ _id });
            return {
                content: `The command "${commandName}" no longer requires any permissions.`,
                ephemeral: true,
            };
        }
        const alreadyExists = await required_permissions_schema_1.default.findOne({
            _id,
            permissions: {
                $in: [permission],
            },
        });
        if (alreadyExists) {
            await required_permissions_schema_1.default.findOneAndUpdate({
                _id,
            }, {
                _id,
                $pull: {
                    permissions: permission,
                },
            });
            return {
                content: `The command "${commandName}" no longer requires the permission "${permission}"`,
                ephemeral: true,
            };
        }
        await required_permissions_schema_1.default.findOneAndUpdate({
            _id,
        }, {
            _id,
            $addToSet: {
                permissions: permission,
            },
        }, {
            upsert: true,
        });
        return {
            content: `The command "${commandName}" now requires the permission "${permission}"`,
            ephemeral: true,
        };
    },
};
