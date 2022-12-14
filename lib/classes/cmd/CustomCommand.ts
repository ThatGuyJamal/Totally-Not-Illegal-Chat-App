import { CommandInteraction, Message } from "discord.js";

import customCommandSchema from "../../models/custom-command-schema.js";
import CommandHandler from "./CommandHandler.js";
import ACH from "../../main.js";

export default class CustomCommands {
  // guildId-commandName: response
  public _customCommands = new Map();
  private _commandHandler: CommandHandler;
  private _instance: ACH;

  public constructor(instance: ACH, commandHandler: CommandHandler) {
    this._instance = instance;
    this._commandHandler = commandHandler;

    this.loadCommands();
  }

  public async loadCommands() {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const results = await customCommandSchema.find({});

    for (const result of results) {
      const { _id, response } = result;
      this._customCommands.set(_id, response);
    }
  }

  public getCommands(guildId: string) {
    const commands = [];

    for (const [key] of this._customCommands) {
      const [id, commandName] = key.split("-");
      if (id === guildId) {
        commands.push(commandName);
      }
    }

    return commands;
  }

  public async create(
    guildId: string,
    commandName: string,
    description: string,
    response: string
  ) {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const _id = `${guildId}-${commandName}`;

    this._customCommands.set(_id, response);

    this._commandHandler.slashCommands.create(
      commandName,
      description,
      [],
      guildId
    );

    await customCommandSchema.findOneAndUpdate(
      {
        _id,
      },
      {
        _id,
        response,
      },
      {
        upsert: true,
      }
    );
  }

  public async delete(guildId: string, commandName: string) {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const _id = `${guildId}-${commandName}`;

    this._customCommands.delete(_id);

    this._commandHandler.slashCommands.delete(commandName, guildId);

    await customCommandSchema.deleteOne({ _id });
  }

  public async run(
    commandName: string,
    message: Message | null,
    interaction: CommandInteraction | null
  ) {
    if (!message && !interaction) {
      return;
    }

    const guild = message ? message.guild : interaction!.guild;
    if (!guild) {
      return;
    }

    const _id = `${guild.id}-${commandName}`;
    const response = this._customCommands.get(_id);
    if (!response) {
      return;
    }

    if (message) message.channel.send(response).catch(() => {});
    else if (interaction) interaction.reply(response).catch(() => {});
  }
}
