"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const disabled_commands_schema_1 = __importDefault(require("../models/disabled-commands-schema"));
class DisabledCommands {
    // array of `${guildId}-${commandName}`
    _disabledCommands = [];
    _instance;
    constructor(instance) {
        this._instance = instance;
        this.loadDisabledCommands();
    }
    async loadDisabledCommands() {
        if (!this._instance.isConnectedToDB) {
            return;
        }
        const results = await disabled_commands_schema_1.default.find({});
        for (const result of results) {
            this._disabledCommands.push(result._id);
        }
    }
    async disable(guildId, commandName) {
        if (!this._instance.isConnectedToDB ||
            this.isDisabled(guildId, commandName)) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        this._disabledCommands.push(_id);
        try {
            await new disabled_commands_schema_1.default({
                _id,
            }).save();
        }
        catch (ignored) { }
    }
    async enable(guildId, commandName) {
        if (!this._instance.isConnectedToDB ||
            !this.isDisabled(guildId, commandName)) {
            return;
        }
        const _id = `${guildId}-${commandName}`;
        this._disabledCommands = this._disabledCommands.filter((id) => id !== _id);
        await disabled_commands_schema_1.default.deleteOne({ _id });
    }
    isDisabled(guildId, commandName) {
        return this._disabledCommands.includes(`${guildId}-${commandName}`);
    }
}
exports.default = DisabledCommands;
