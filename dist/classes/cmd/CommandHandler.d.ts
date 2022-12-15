import Command from "./Command.js";
import SlashCommands from "./SlashCommand.js";
import ChannelCommands from "./ChannelCommand.js";
import CustomCommands from "./CustomCommand.js";
import DisabledCommands from "./DisabledCommands.js";
import PrefixHandler from "./PrefixHandler.js";
import ACH from "../../main.js";
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
    private _v;
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