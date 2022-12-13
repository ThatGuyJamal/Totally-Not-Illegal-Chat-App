"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const channel_commands_schema_1 = __importDefault(require("../models/channel-commands-schema"));
class ChannelCommands {
    // `${guildId}-${commandName}`: [channelIds]
    _channelCommands = new Map();
    _instance;
    constructor(instance) {
        this._instance = instance;
    }
    async action(action, guildId, commandName, channelId) {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        const result = await channel_commands_schema_1.default.findOneAndUpdate({
            _id,
        }, {
            _id,
            [action === "add" ? "$addToSet" : "$pull"]: {
                channels: channelId,
            },
        }, {
            upsert: true,
            new: true,
        });
        this._channelCommands.set(_id, result.channels);
        return result.channels;
    }
    async add(guildId, commandName, channelId) {
        return await this.action("add", guildId, commandName, channelId);
    }
    async remove(guildId, commandName, channelId) {
        return await this.action("remove", guildId, commandName, channelId);
    }
    async getAvailableChannels(guildId, commandName) {
        if (!this._instance.isConnectedToDB) {
            return [];
        }
        const _id = `${guildId}-${commandName}`;
        let channels = this._channelCommands.get(_id);
        if (!channels) {
            const results = await channel_commands_schema_1.default.findById(_id);
            channels = results ? results.channels : [];
            this._channelCommands.set(_id, channels);
        }
        return channels;
    }
}
exports.default = ChannelCommands;
