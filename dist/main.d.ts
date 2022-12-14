import type { Client } from "discord.js";
import CommandHandler from "./classes/cmd/CommandHandler.js";
import EventHandler from "./classes/event/EventHandler.js";
import { Cooldowns } from "./classes/util/Cooldowns.js";
import { DefaultCommands, Validations, ClientOptions } from "./typings/index.js";
/**
 * @class
 * @version 1.0.0
 * @description The main class for Abyss Command Handler.
 */
export default class AbyssCommandHandler {
    _client: Client;
    _testServers: string[];
    _botOwners: string[];
    _defaultPrefix: string;
    _cooldowns: Cooldowns | undefined;
    _disabledDefaultCommands: DefaultCommands[];
    _validations: Validations;
    _commandHandler: CommandHandler;
    _eventHandler: EventHandler;
    _isConnectedToDB: boolean;
    constructor(options: ClientOptions);
    private init;
    /**
     * @param mongoUri The MongoDB connection URI
     */
    private connectToMongo;
    get isConnectedToDB(): boolean;
    get client(): Client;
    get testServers(): string[];
    get botOwners(): string[];
    get cooldowns(): Cooldowns | undefined;
    get disabledDefaultCommands(): DefaultCommands[];
    get commandHandler(): CommandHandler;
    get eventHandler(): EventHandler;
    get validations(): Validations;
}
//# sourceMappingURL=main.d.ts.map