import mongoose from "mongoose";
import CommandHandler from "./classes/cmd/CommandHandler.js";
import EventHandler from "./classes/event/EventHandler.js";
import FeaturesHandler from "./classes/util/Features.js";
import { Cooldowns } from "./classes/util/Cooldowns.js";
// The prefix used if non is passed
const noPrefixValue = "??";
/**
 * @class
 * @version 1.0.0
 * @description The main class for Abyss Command Handler.
 */
export default class AbyssCommandHandler {
    _client;
    _testServers;
    _botOwners;
    _defaultPrefix;
    _cooldowns;
    _disabledDefaultCommands;
    _validations;
    _commandHandler;
    _eventHandler;
    _isConnectedToDB = false;
    constructor(options) {
        this.init(options);
    }
    async init(options) {
        let { client, mongoUri, commandsDir, featuresDir, defaultPrefix, testServers = [], botOwners = [], cooldownConfig, disabledDefaultCommands = [], events = {}, validations = {}, } = options;
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
        this._defaultPrefix = defaultPrefix || noPrefixValue;
        this._botOwners = botOwners;
        this._disabledDefaultCommands = disabledDefaultCommands;
        this._validations = validations;
        this._cooldowns = new Cooldowns(this, {
            errorMessage: "Please wait {TIME} before doing that again.",
            botOwnersBypass: false,
            dbRequired: 300,
            ...cooldownConfig,
        });
        if (commandsDir) {
            this._commandHandler = new CommandHandler(this, commandsDir, client);
        }
        if (featuresDir) {
            new FeaturesHandler(this, featuresDir, client);
        }
        this._eventHandler = new EventHandler(this, events, client);
    }
    /**
     * @param mongoUri The MongoDB connection URI
     */
    async connectToMongo(mongoUri) {
        await mongoose.connect(mongoUri, {
            keepAlive: true,
        });
        this._isConnectedToDB = true;
    }
    get isConnectedToDB() {
        return this._isConnectedToDB;
    }
    get client() {
        return this._client;
    }
    get testServers() {
        return this._testServers;
    }
    get botOwners() {
        return this._botOwners;
    }
    get cooldowns() {
        return this._cooldowns;
    }
    get disabledDefaultCommands() {
        return this._disabledDefaultCommands;
    }
    get commandHandler() {
        return this._commandHandler;
    }
    get eventHandler() {
        return this._eventHandler;
    }
    get validations() {
        return this._validations;
    }
}
