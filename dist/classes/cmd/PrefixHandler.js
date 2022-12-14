"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const guild_prefix_schema_1 = __importDefault(require("../../models/guild-prefix-schema"));
const discord_js_1 = require("discord.js");
class PrefixHandler {
    // <guildId: prefix>
    _prefixes = new discord_js_1.Collection();
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
        const results = await guild_prefix_schema_1.default.find({});
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
        await guild_prefix_schema_1.default
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
exports.default = PrefixHandler;
