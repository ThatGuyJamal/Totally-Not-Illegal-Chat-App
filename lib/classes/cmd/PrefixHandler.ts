import guildPrefixSchema from "../../models/guild-prefix-schema.js";
import { Collection } from "discord.js";
import ACH from "../../main.js";

export default class PrefixHandler {
  // <guildId: prefix>
  public _prefixes = new Collection<string, string>();
  private _defaultPrefix: string;
  private _instance: ACH;

  constructor(instance: ACH) {
    this._instance = instance;

    this._defaultPrefix = instance._defaultPrefix;

    this.loadPrefixes();
  }

  /**
   * Loads all the prefixes from the database into cache
   * @returns
   */
  private async loadPrefixes() {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const results = await guildPrefixSchema.find({});

    for (const result of results) {
      this._prefixes.set(result._id, result.prefix);
    }
  }

  public get defaultPrefix() {
    return this._defaultPrefix;
  }

  /**
   * @param guildId The guild id to get the prefix for
   * @returns The prefix for the guild
   */
  public get(guildId?: string): string {
    if (!guildId) {
      return this.defaultPrefix;
    }

    return this._prefixes.get(guildId) || this.defaultPrefix;
  }

  public async set(guildId: string, prefix: string) {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    this._prefixes.set(guildId, prefix);

    await guildPrefixSchema
      .findOneAndUpdate(
        {
          _id: guildId,
        },
        {
          _id: guildId,
          prefix,
        },
        {
          upsert: true,
        }
      )
      .exec();
  }
}
