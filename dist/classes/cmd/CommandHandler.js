import getAllFiles from "../../utils/get-all-files.js";
import Command from "./Command.js";
import SlashCommands from "./SlashCommand.js";
import ChannelCommands from "./ChannelCommand.js";
import CustomCommands from "./CustomCommand.js";
import DisabledCommands from "./DisabledCommands.js";
import PrefixHandler from "./PrefixHandler.js";
import { Collection, } from "discord.js";
import path from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { DefaultCommands, CommandType, } from "../../typings/index.js";
export default class CommandHandler {
    // <commandName, instance of the Command class>
    _commands = new Collection();
    _validations = this.getValidations(path.join(__dirname, "../../validations", "runtime"));
    _instance;
    _client;
    _commandsDir;
    _slashCommands;
    _channelCommands;
    _customCommands;
    _disabledCommands;
    _prefixes;
    constructor(instance, commandsDir, client) {
        this._instance = instance;
        this._commandsDir = commandsDir;
        this._slashCommands = new SlashCommands(client);
        this._client = client;
        this._channelCommands = new ChannelCommands(instance);
        this._customCommands = new CustomCommands(instance, this);
        this._disabledCommands = new DisabledCommands(instance);
        this._prefixes = new PrefixHandler(instance);
        //@ts-ignore
        this._validations = [
            //@ts-ignore
            ...this._validations,
            //@ts-ignore
            ...this.getValidations(instance.validations?.runtime),
        ];
        this.readFiles();
    }
    async readFiles() {
        const defaultCommands = await getAllFiles(path.join(__dirname, "../../internal/commands"));
        const files = await getAllFiles(this._commandsDir);
        const validations = [
            ...(await this.getValidations(path.join(__dirname, "../../validations", "syntax"))),
            ...(await this.getValidations(this._instance.validations?.syntax)),
        ];
        for (let fileData of [...defaultCommands, ...files]) {
            const { filePath } = fileData;
            const commandObject = fileData.fileContents;
            const split = filePath.split(/[\/\\]/);
            let commandName = split.pop();
            commandName = commandName.split(".")[0];
            const command = new Command(this._instance, commandName, commandObject);
            const { description, type, testOnly, delete: del, aliases = [], init = () => { }, } = commandObject;
            let defaultCommandValue;
            for (const [key, value] of Object.entries(DefaultCommands)) {
                if (value === commandName.toLowerCase()) {
                    defaultCommandValue =
                        DefaultCommands[key];
                    break;
                }
            }
            if (del ||
                (defaultCommandValue &&
                    this._instance.disabledDefaultCommands.includes(defaultCommandValue))) {
                if (type === "SLASH" || type === "BOTH") {
                    if (testOnly) {
                        for (const guildId of this._instance.testServers) {
                            this._slashCommands.delete(command.commandName, guildId);
                        }
                    }
                    else {
                        this._slashCommands.delete(command.commandName);
                    }
                }
                continue;
            }
            for (const validation of validations) {
                validation(command);
            }
            await init(this._client, this._instance);
            const names = [command.commandName, ...aliases];
            for (const name of names) {
                this._commands.set(name, command);
            }
            if (type === "SLASH" || type === "BOTH") {
                const options = commandObject.options ||
                    this._slashCommands.createOptions(commandObject);
                if (testOnly) {
                    for (const guildId of this._instance.testServers) {
                        this._slashCommands.create(command.commandName, description, options, guildId);
                    }
                }
                else {
                    this._slashCommands.create(command.commandName, description, options);
                }
            }
        }
    }
    async runCommand(command, args, message, interaction) {
        const { callback, type, cooldowns } = command.commandObject;
        if (message && type === CommandType.SLASH) {
            return;
        }
        const guild = message ? message.guild : interaction?.guild;
        const member = (message ? message.member : interaction?.member);
        const user = message ? message.author : interaction?.user;
        const channel = (message ? message.channel : interaction?.channel);
        const usage = {
            client: command.instance.client,
            instance: command.instance,
            message,
            interaction,
            args,
            text: args.join(" "),
            guild,
            member,
            user: user,
            channel,
        };
        for (const validation of await this._validations) {
            if (!(await validation(command, usage, this._prefixes.get(guild?.id)))) {
                return;
            }
        }
        if (cooldowns) {
            const cooldownUsage = {
                cooldownType: cooldowns.type,
                userId: user.id,
                actionId: `command_${command.commandName}`,
                guildId: guild?.id,
                duration: cooldowns.duration,
                errorMessage: cooldowns.errorMessage,
            };
            const result = this._instance.cooldowns?.canRunAction(cooldownUsage);
            if (typeof result === "string") {
                return result;
            }
            await this._instance.cooldowns?.start(cooldownUsage);
            usage.cancelCooldown = () => {
                this._instance.cooldowns?.cancelCooldown(cooldownUsage);
            };
            usage.updateCooldown = (expires) => {
                this._instance.cooldowns?.updateCooldown(cooldownUsage, expires);
            };
        }
        return await callback(usage);
    }
    async getValidations(folder) {
        if (!folder) {
            return [];
        }
        return (await getAllFiles(folder)).map((fileData) => fileData.fileContents);
    }
    get commands() {
        return this._commands;
    }
    get channelCommands() {
        return this._channelCommands;
    }
    get slashCommands() {
        return this._slashCommands;
    }
    get customCommands() {
        return this._customCommands;
    }
    get disabledCommands() {
        return this._disabledCommands;
    }
    get prefixHandler() {
        return this._prefixes;
    }
}
