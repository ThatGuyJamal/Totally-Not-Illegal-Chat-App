import { Collection } from "discord.js";
import ACH from "../../main";
declare class ChannelCommands {
    _channelCommands: Collection<string, string[]>;
    private _instance;
    constructor(instance: ACH);
    action(action: "add" | "remove", guildId: string, commandName: string, channelId: string): Promise<any>;
    /**
     * Adds a command to the channel only command list
     * @param guildId
     * @param commandName
     * @param channelId
     * @returns
     */
    add(guildId: string, commandName: string, channelId: string): Promise<any>;
    remove(guildId: string, commandName: string, channelId: string): Promise<any>;
    getAvailableChannels(guildId: string, commandName: string): Promise<string[]>;
}
export default ChannelCommands;
//# sourceMappingURL=ChannelCommand.d.ts.map