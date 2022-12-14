import { CommandInteraction, Message } from "discord.js";
import CommandHandler from "./CommandHandler";
import ACH from "../../main";
export default class CustomCommands {
    _customCommands: Map<any, any>;
    private _commandHandler;
    private _instance;
    constructor(instance: ACH, commandHandler: CommandHandler);
    loadCommands(): Promise<void>;
    getCommands(guildId: string): any[];
    create(guildId: string, commandName: string, description: string, response: string): Promise<void>;
    delete(guildId: string, commandName: string): Promise<void>;
    run(commandName: string, message: Message | null, interaction: CommandInteraction | null): Promise<void>;
}
//# sourceMappingURL=CustomCommand.d.ts.map