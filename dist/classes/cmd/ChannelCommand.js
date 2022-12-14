import { Collection } from "discord.js";
import channelCommands from "../../models/channel-commands-schema.js";
class ChannelCommands {
    // `${guildId}-${commandName}`: [channelIds]
    _channelCommands = new Collection();
    _instance;
    constructor(instance) {
        this._instance = instance;
    }
    async action(action, guildId, commandName, channelId) {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        const result = await channelCommands.findOneAndUpdate({
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
    /**
     * Adds a command to the channel only command list
     * @param guildId
     * @param commandName
     * @param channelId
     * @returns
     */
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
            const results = await channelCommands.findById(_id);
            channels = results ? results.channels : [];
            this._channelCommands.set(_id, channels);
        }
        return channels || [];
    }
}
export default ChannelCommands;
