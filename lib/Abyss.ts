import mongoose from "mongoose";

import ACH, {
  Cooldowns,
  DefaultCommands,
  Validations,
  ClientOptions,
  Events,
} from "../typings";
import type { Client } from "discord.js";
import CommandHandler from "./classes/cmd/CommandHandler";
import EventHandler from "./classes/event/EventHandler";
import FeaturesHandler from "./classes/util/Features";

class AbyssCommandHandler {
  public _client!: Client;
  public _testServers!: string[];
  public _botOwners!: string[];
  public _cooldowns: Cooldowns | undefined;
  public _disabledDefaultCommands!: DefaultCommands[];
  public _validations!: Validations;
  public _commandHandler: CommandHandler | undefined;
  public _eventHandler!: EventHandler;
  public _isConnectedToDB = false;

  public constructor(options: ClientOptions) {
    this.init(options);
  }

  private async init(options: ClientOptions) {
    let {
      client,
      mongoUri,
      commandsDir,
      featuresDir,
      defaultPrefix,
      testServers = [],
      botOwners = [],
      cooldownConfig,
      disabledDefaultCommands = [],
      events = {},
      validations = {},
    } = options;

    if (!client) {
      throw new Error("A client is required.");
    }

    if (mongoUri) {
      await this.connectToMongo(mongoUri);
    }

    // Add the bot owner's ID
    if (botOwners.length === 0) {
      await client.application?.fetch();
      const ownerId = client.application?.owner?.id;
      if (ownerId && botOwners.indexOf(ownerId) === -1) {
        botOwners.push(ownerId);
      }
    }

    this._client = client;
    this._testServers = testServers;
    this._botOwners = botOwners;
    this._disabledDefaultCommands = disabledDefaultCommands;
    this._validations = validations;

    this._cooldowns = new Cooldowns(this as unknown as ACH, {
      errorMessage: "Please wait {TIME} before doing that again.",
      botOwnersBypass: false,
      dbRequired: 300, // 5 minutes
      ...cooldownConfig,
    });
    if (commandsDir) {
      this._commandHandler = new CommandHandler(
        this as unknown as ACH,
        commandsDir,
        client
      );
    }

    if (featuresDir) {
      new FeaturesHandler(this as unknown as ACH, featuresDir, client);
    }

    this._eventHandler = new EventHandler(
      this as unknown as ACH,
      events as Events,
      client
    );
  }

  /**
   * @param mongoUri The MongoDB connection URI
   */
  private async connectToMongo(mongoUri: string) {
    await mongoose.connect(mongoUri, {
      keepAlive: true,
    });

    this._isConnectedToDB = true;
  }

  public get isConnectedToDB(): boolean {
    return this._isConnectedToDB;
  }

  public get client(): Client {
    return this._client;
  }

  public get testServers(): string[] {
    return this._testServers;
  }

  public get botOwners(): string[] {
    return this._botOwners;
  }

  public get cooldowns(): Cooldowns | undefined {
    return this._cooldowns;
  }

  public get disabledDefaultCommands(): DefaultCommands[] {
    return this._disabledDefaultCommands;
  }

  public get commandHandler(): CommandHandler | undefined {
    return this._commandHandler;
  }

  public get eventHandler(): EventHandler {
    return this._eventHandler;
  }

  public get validations(): Validations {
    return this._validations;
  }
}

export { AbyssCommandHandler };
