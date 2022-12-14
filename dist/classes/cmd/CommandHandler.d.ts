import Command from "./Command";
import SlashCommands from "./SlashCommand";
import ChannelCommands from "./ChannelCommand";
import CustomCommands from "./CustomCommand";
import DisabledCommands from "./DisabledCommands";
import PrefixHandler from "./PrefixHandler";
import ACH from "../../main";
import { Client, Collection, CommandInteraction, Message } from "discord.js";
export default class CommandHandler {
    _commands: Collection<string, Command>;
    private _validations;
    private _instance;
    private _client;
    private _commandsDir;
    private _slashCommands;
    private _channelCommands;
    private _customCommands;
    private _disabledCommands;
    private _prefixes;
    constructor(instance: ACH, commandsDir: string, client: Client);
    /**
     * Reads all command files and adds them to the commands cache.
     * All internal commands are loaded from the internal/commands folder.
     */
    private readFiles;
    runCommand(command: Command, args: string[], message: Message | null, interaction: CommandInteraction | null): Promise<any>;
    private getValidations;
    get commands(): Collection<string, Command>;
    get channelCommands(): ChannelCommands;
    get slashCommands(): SlashCommands;
    get customCommands(): CustomCommands;
    get disabledCommands(): DisabledCommands;
    get prefixHandler(): PrefixHandler;
}
//# sourceMappingURL=CommandHandler.d.ts.map