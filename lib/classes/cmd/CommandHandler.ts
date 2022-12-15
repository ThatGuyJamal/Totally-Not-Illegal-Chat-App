import getAllFiles from "../../utils/get-all-files.js";
import Command from "./Command.js";
import SlashCommands from "./SlashCommand.js";
import ChannelCommands from "./ChannelCommand.js";
import CustomCommands from "./CustomCommand.js";
import DisabledCommands from "./DisabledCommands.js";
import PrefixHandler from "./PrefixHandler.js";
import ACH from "../../main.js";

import {
  Client,
  Collection,
  CommandInteraction,
  GuildMember,
  Message,
  TextChannel,
} from "discord.js";

import path from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

import {
  CommandObject,
  DefaultCommands,
  CommandType,
  CommandUsage,
  InternalCooldownConfig,
} from "../../typings/index.js";

export default class CommandHandler {
  // <commandName, instance of the Command class>
  public _commands: Collection<string, Command> = new Collection();

  // private _validations = this.getValidations(
  //   path.join(__dirname, "../../validations", "runtime")
  // );

  private _validations: any[] = [];

  private _instance: ACH;
  private _client: Client;
  private _commandsDir: string;
  private _slashCommands: SlashCommands;
  private _channelCommands: ChannelCommands;
  private _customCommands: CustomCommands;
  private _disabledCommands: DisabledCommands;
  private _prefixes: PrefixHandler;

  public constructor(instance: ACH, commandsDir: string, client: Client) {
    this._instance = instance;
    this._commandsDir = commandsDir;
    this._slashCommands = new SlashCommands(client);
    this._client = client;
    this._channelCommands = new ChannelCommands(instance);
    this._customCommands = new CustomCommands(instance, this);
    this._disabledCommands = new DisabledCommands(instance);
    this._prefixes = new PrefixHandler(instance);

    // this._validations = [
    //   ...this._validations,
    //   ...this.getValidations(instance.validations?.runtime),
    // ];

    this.readFiles();
  }

  private async _v() {
    this._validations = [
      ...this._validations,
      ...(await this.getValidations(this._instance.validations?.runtime)),
    ];
  }

  private async readFiles() {
    const defaultCommands = await getAllFiles(
      path.join(__dirname, "../../internal/commands")
    );
    const files = await getAllFiles(this._commandsDir);

    const validations = [
      ...(await this.getValidations(
        path.join(__dirname, "../../validations", "syntax")
      )),
      ...(await this.getValidations(this._instance.validations?.syntax)),
    ];

    for (let fileData of [...defaultCommands, ...files]) {
      const { filePath } = fileData;
      const commandObject: CommandObject = fileData.fileContents;

      const split = filePath.split(/[\/\\]/);
      let commandName = split.pop()!;
      commandName = commandName.split(".")[0];

      const command = new Command(this._instance, commandName, commandObject);

      const {
        description,
        type,
        testOnly,
        delete: del,
        aliases = [],
        init = () => {},
      } = commandObject;

      let defaultCommandValue: DefaultCommands | undefined;

      for (const [key, value] of Object.entries(DefaultCommands)) {
        if (value === commandName.toLowerCase()) {
          defaultCommandValue =
            DefaultCommands[key as keyof typeof DefaultCommands];
          break;
        }
      }

      if (
        del ||
        (defaultCommandValue &&
          this._instance.disabledDefaultCommands.includes(defaultCommandValue))
      ) {
        if (type === "SLASH" || type === "BOTH") {
          if (testOnly) {
            for (const guildId of this._instance.testServers) {
              this._slashCommands.delete(command.commandName, guildId);
            }
          } else {
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
        const options =
          commandObject.options ||
          this._slashCommands.createOptions(commandObject);

        if (testOnly) {
          for (const guildId of this._instance.testServers) {
            this._slashCommands.create(
              command.commandName,
              description!,
              options,
              guildId
            );
          }
        } else {
          this._slashCommands.create(
            command.commandName,
            description!,
            options
          );
        }
      }
    }
  }

  public async runCommand(
    command: Command,
    args: string[],
    message: Message | null,
    interaction: CommandInteraction | null
  ) {
    const { callback, type, cooldowns } = command.commandObject;

    if (message && type === CommandType.SLASH) {
      return;
    }

    const guild = message ? message.guild : interaction?.guild;
    const member = (
      message ? message.member : interaction?.member
    ) as GuildMember;
    const user = message ? message.author : interaction?.user;
    const channel = (
      message ? message.channel : interaction?.channel
    ) as TextChannel;

    const usage: CommandUsage = {
      client: command.instance.client,
      instance: command.instance,
      message,
      interaction,
      args,
      text: args.join(" "),
      guild,
      member,
      user: user!,
      channel,
    };

    for (const validation of await this._validations) {
      if (!(await validation(command, usage, this._prefixes.get(guild?.id)))) {
        return;
      }
    }

    if (cooldowns) {
      const cooldownUsage: InternalCooldownConfig = {
        cooldownType: cooldowns.type,
        userId: user!.id,
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

      usage.updateCooldown = (expires: Date) => {
        this._instance.cooldowns?.updateCooldown(cooldownUsage, expires);
      };
    }

    return await callback(usage);
  }

  private async getValidations(folder?: string): Promise<any[]> {
    if (!folder) {
      return [];
    }

    return (await getAllFiles(folder)).map((fileData) => fileData.fileContents);
  }

  public get commands() {
    return this._commands;
  }

  public get channelCommands() {
    return this._channelCommands;
  }

  public get slashCommands() {
    return this._slashCommands;
  }

  public get customCommands() {
    return this._customCommands;
  }

  public get disabledCommands() {
    return this._disabledCommands;
  }

  public get prefixHandler() {
    return this._prefixes;
  }
}
