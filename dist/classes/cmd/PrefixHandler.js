import guildPrefixSchema from "../../models/guild-prefix-schema.js";
import { Collection } from "discord.js";
export default class PrefixHandler {
    // <guildId: prefix>
    _prefixes = new Collection();
    _defaultPrefix;
    _instance;
    constructor(instance) {
        this._instance = instance;
        this._defaultPrefix = instance._defaultPrefix;
        this.loadPrefixes();
    }
    /**
     * Loads all the prefixes from the database into cache
     * @returns
     */
    async loadPrefixes() {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const results = await guildPrefixSchema.find({});
        for (const result of results) {
            this._prefixes.set(result._id, result.prefix);
        }
    }
    get defaultPrefix() {
        return this._defaultPrefix;
    }
    /**
     * @param guildId The guild id to get the prefix for
     * @returns The prefix for the guild
     */
    get(guildId) {
        if (!guildId) {
            return this.defaultPrefix;
        }
        return this._prefixes.get(guildId) || this.defaultPrefix;
    }
    async set(guildId, prefix) {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        this._prefixes.set(guildId, prefix);
        await guildPrefixSchema
            .findOneAndUpdate({
            _id: guildId,
        }, {
            _id: guildId,
            prefix,
        }, {
            upsert: true,
        })
            .exec();
    }
}
