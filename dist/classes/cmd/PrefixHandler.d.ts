import { Collection } from "discord.js";
import ACH from "../../main.js";
export default class PrefixHandler {
    _prefixes: Collection<string, string>;
    private _defaultPrefix;
    private _instance;
    constructor(instance: ACH);
    /**
     * Loads all the prefixes from the database into cache
     * @returns
     */
    private loadPrefixes;
    get defaultPrefix(): string;
    /**
     * @param guildId The guild id to get the prefix for
     * @returns The prefix for the guild
     */
    get(guildId?: string): string;
    set(guildId: string, prefix: string): Promise<void>;
}
//# sourceMappingURL=PrefixHandler.d.ts.map