export var CommandType;
(function (CommandType) {
    CommandType["SLASH"] = "SLASH";
    CommandType["LEGACY"] = "LEGACY";
    CommandType["BOTH"] = "BOTH";
})(CommandType || (CommandType = {}));
export var CooldownTypes;
(function (CooldownTypes) {
    CooldownTypes["perUser"] = "perUser";
    CooldownTypes["perUserPerGuild"] = "perUserPerGuild";
    CooldownTypes["perGuild"] = "perGuild";
    CooldownTypes["global"] = "global";
})(CooldownTypes || (CooldownTypes = {}));
export var DefaultCommands;
(function (DefaultCommands) {
    DefaultCommands["ChannelCommand"] = "channelcommand";
    DefaultCommands["CustomCommand"] = "customcommand";
    DefaultCommands["Prefix"] = "prefix";
    DefaultCommands["RequiredPermissions"] = "requiredpermissions";
    DefaultCommands["RequiredRoles"] = "requiredroles";
    DefaultCommands["ToggleCommand"] = "togglecommand";
})(DefaultCommands || (DefaultCommands = {}));
