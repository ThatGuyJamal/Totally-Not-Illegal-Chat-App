"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const required_permissions_schema_1 = __importDefault(require("../../../models/required-permissions-schema"));
const keys = Object.keys(discord_js_1.PermissionFlagsBits);
exports.default = async (command, usage) => {
    const { permissions = [] } = command.commandObject;
    const { instance, guild, member, message, interaction } = usage;
    if (!member || !instance.isConnectedToDB) {
        return true;
    }
    const document = await required_permissions_schema_1.default.findById(`${guild.id}-${command.commandName}`);
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
                (key) => key === permission || discord_js_1.PermissionFlagsBits[key] === permission);
                missingPermissions.push(permissionName);
            }
        }
        if (missingPermissions.length) {
            const text = `You are missing the following permissions: "${missingPermissions.join('", "')}"`;
            if (message)
                message.reply(text);
            else if (interaction)
                interaction.reply(text);
            return false;
        }
    }
    return true;
};
