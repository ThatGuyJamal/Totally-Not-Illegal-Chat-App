"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
class SlashCommand {
    _client;
    constructor(client) {
        this._client = client;
    }
    /**
     * @param guildId of the guild to get the commands from
     * @returns The commands of the guild or the global commands
     */
    async getCommands(guildId) {
        let commands;
        if (guildId) {
            const guild = await this._client.guilds.fetch(guildId);
            commands = guild.commands;
        }
        else {
            commands = this._client.application?.commands;
        }
        // @ts-ignore
        await commands?.fetch();
        return commands;
    }
    /**
     * Checks if the command api options have been changed
     * @param options The options for the command
     * @param existingOptions The existing options for the command
     * @returns {boolean}
     */
    areOptionsDifferent(options, existingOptions) {
        for (let a = 0; a < options.length; ++a) {
            const option = options[a];
            const existing = existingOptions[a];
            if (option.name !== existing.name ||
                option.type !== existing.type ||
                option.description !== existing.description) {
                return true;
            }
        }
        return false;
    }
    /**
     * Creates a new slash command on the api.
     * @param name of the command
     * @param description  of the command
     * @param options of the command
     * @param guildId of the guild to create the command in. If not provided, the command will be global
     * @returns {Promise<void>}
     */
    async create(name, description, options, guildId) {
        const commands = await this.getCommands(guildId);
        if (!commands) {
            throw new Error(`Could not find commands for guild ${guildId}`);
        }
        const existingCommand = commands.cache.find((cmd) => cmd.name === name);
        if (existingCommand) {
            const { description: existingDescription, options: existingOptions } = existingCommand;
            if (description !== existingDescription ||
                options.length !== existingOptions.length ||
                this.areOptionsDifferent(options, existingOptions)) {
                console.log(`Updating the command "${name}"`);
                await commands.edit(existingCommand.id, {
                    description,
                    options,
                });
            }
            return;
        }
        await commands.create({
            name,
            description,
            options,
        });
    }
    /**
     * Deletes a command from the api
     * @param commandName
     * @param guildId
     * @returns
     */
    async delete(commandName, guildId) {
        const commands = await this.getCommands(guildId);
        const existingCommand = commands?.cache.find((cmd) => cmd.name === commandName);
        if (!existingCommand) {
            return;
        }
        await existingCommand.delete();
    }
    /**
     * Creates the options for a slash command
     * @returns {ApplicationCommandOption[]}
     */
    createOptions({ expectedArgs = "", minArgs = 0, }) {
        const options = [];
        // <num 1> <num 2>
        if (expectedArgs) {
            const split = expectedArgs
                .substring(1, expectedArgs.length - 1)
                // num 1> <num 2
                .split(/[>\]] [<\[]/);
            // ['num 1', 'num 2']
            for (let a = 0; a < split.length; ++a) {
                const arg = split[a];
                options.push({
                    name: arg.toLowerCase().replace(/\s+/g, "-"),
                    description: arg,
                    type: discord_js_1.ApplicationCommandOptionType.String,
                    required: a < minArgs,
                });
            }
        }
        return options;
    }
}
exports.default = SlashCommand;
//# sourceMappingURL=SlashCommand.js.map