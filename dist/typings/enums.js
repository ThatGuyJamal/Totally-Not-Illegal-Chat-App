"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DefaultCommands = exports.CooldownTypes = exports.CommandType = void 0;
var CommandType;
(function (CommandType) {
    CommandType["SLASH"] = "SLASH";
    CommandType["LEGACY"] = "LEGACY";
    CommandType["BOTH"] = "BOTH";
})(CommandType || (CommandType = {}));
exports.CommandType = CommandType;
var CooldownTypes;
(function (CooldownTypes) {
    CooldownTypes["perUser"] = "perUser";
    CooldownTypes["perUserPerGuild"] = "perUserPerGuild";
    CooldownTypes["perGuild"] = "perGuild";
    CooldownTypes["global"] = "global";
})(CooldownTypes || (CooldownTypes = {}));
exports.CooldownTypes = CooldownTypes;
var DefaultCommands;
(function (DefaultCommands) {
    DefaultCommands["ChannelCommand"] = "channelcommand";
    DefaultCommands["CustomCommand"] = "customcommand";
    DefaultCommands["Prefix"] = "prefix";
    DefaultCommands["RequiredPermissions"] = "requiredpermissions";
    DefaultCommands["RequiredRoles"] = "requiredroles";
    DefaultCommands["ToggleCommand"] = "togglecommand";
})(DefaultCommands || (DefaultCommands = {}));
exports.DefaultCommands = DefaultCommands;
