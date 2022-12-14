import { ApplicationCommandOption, Client } from "discord.js";
export default class SlashCommand {
    private _client;
    constructor(client: Client);
    /**
     * @param guildId of the guild to get the commands from
     * @returns The commands of the guild or the global commands
     */
    getCommands(guildId?: string): Promise<import("discord.js").GuildApplicationCommandManager | import("discord.js").ApplicationCommandManager<import("discord.js").ApplicationCommand<{
        guild: import("discord.js").GuildResolvable;
    }>, {
        guild: import("discord.js").GuildResolvable;
    }, null> | undefined>;
    /**
     * Checks if the command api options have been changed
     * @param options The options for the command
     * @param existingOptions The existing options for the command
     * @returns {boolean}
     */
    areOptionsDifferent(options: ApplicationCommandOption[], existingOptions: any[]): boolean;
    /**
     * Creates a new slash command on the api.
     * @param name of the command
     * @param description  of the command
     * @param options of the command
     * @param guildId of the guild to create the command in. If not provided, the command will be global
     * @returns {Promise<void>}
     */
    create(name: string, description: string, options: ApplicationCommandOption[], guildId?: string): Promise<void>;
    /**
     * Deletes a command from the api
     * @param commandName
     * @param guildId
     * @returns
     */
    delete(commandName: string, guildId?: string): Promise<void>;
    /**
     * Creates the options for a slash command
     * @returns {ApplicationCommandOption[]}
     */
    createOptions({ expectedArgs, minArgs, }: {
        expectedArgs?: string | undefined;
        minArgs?: number | undefined;
    }): ApplicationCommandOption[];
}
//# sourceMappingURL=SlashCommand.d.ts.map