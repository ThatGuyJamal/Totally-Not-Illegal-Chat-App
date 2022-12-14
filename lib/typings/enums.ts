enum CommandType {
	SLASH = "SLASH",
	LEGACY = "LEGACY",
	BOTH = "BOTH",
}

enum CooldownTypes {
	perUser = "perUser",
	perUserPerGuild = "perUserPerGuild",
	perGuild = "perGuild",
	global = "global",
}

enum DefaultCommands {
	ChannelCommand = "channelcommand",
	CustomCommand = "customcommand",
	Prefix = "prefix",
	RequiredPermissions = "requiredpermissions",
	RequiredRoles = "requiredroles",
	ToggleCommand = "togglecommand",
}

export { CommandType, CooldownTypes, DefaultCommands };
