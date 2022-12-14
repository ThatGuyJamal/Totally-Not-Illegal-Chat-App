"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCommands = exports.CooldownTypes = exports.CommandType = exports.Command = exports.AbyssCommandHandler = void 0;
const main_1 = __importDefault(require("./main"));
exports.AbyssCommandHandler = main_1.default;
const Command_1 = __importDefault(require("./classes/cmd/Command"));
exports.Command = Command_1.default;
const typings_1 = require("./typings");
Object.defineProperty(exports, "CommandType", { enumerable: true, get: function () { return typings_1.CommandType; } });
Object.defineProperty(exports, "CooldownTypes", { enumerable: true, get: function () { return typings_1.CooldownTypes; } });
Object.defineProperty(exports, "DefaultCommands", { enumerable: true, get: function () { return typings_1.DefaultCommands; } });
//# sourceMappingURL=index.js.map