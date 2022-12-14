// Imported Data from packages
import {
  Client,
  ApplicationCommandOption,
  CommandInteraction,
  Guild,
  GuildMember,
  TextChannel,
  User,
  Message,
} from "discord.js";
import AbyssCommandHandler from "../main.js";

/**
 * @class
 * @version 1.0.0
 * @description The main class for Abyss Command Handler.
 */

export interface ClientOptions {
  client: Client;
  mongoUri?: string;
  commandsDir?: string;
  featuresDir?: string;
  testServers?: string[];
  botOwners?: string[];
  defaultPrefix?: string;
  cooldownConfig?: CooldownConfig;
  disabledDefaultCommands?: DefaultCommands[];
  events?: Events;
  validations?: Validations;
}

export interface CooldownConfig {
  errorMessage: string;
  botOwnersBypass: boolean;
  dbRequired: number;
}

export interface Events {
  dir: string;
  [key: string]: any;
}

export interface Validations {
  runtime?: string;
  syntax?: string;
}

export interface CooldownUsage {
  errorMessage?: string;
  type: CooldownTypes;
  duration: string;
}

export interface InternalCooldownConfig {
  cooldownType: CooldownTypes;
  userId: string;
  actionId: string;
  guildId?: string;
  duration?: string;
  errorMessage?: string;
}

export interface CommandUsage {
  client: Client;
  instance: AbyssCommandHandler;
  message?: Message | null;
  interaction?: CommandInteraction | null;
  args: string[];
  text: string;
  guild?: Guild | null;
  member?: GuildMember;
  user: User;
  channel?: TextChannel;
  cancelCooldown?: Function;
  updateCooldown?: Function;
}

export interface CommandObject {
  callback: Function;
  type: CommandType;
  init?: Function;
  description?: string;
  aliases?: string[];
  testOnly?: boolean;
  guildOnly?: boolean;
  ownerOnly?: boolean;
  permissions?: bigint[];
  deferReply?: "ephemeral" | boolean;
  cooldowns?: CooldownUsage;
  minArgs?: number;
  maxArgs?: number;
  correctSyntax?: string;
  expectedArgs?: string;
  options?: ApplicationCommandOption[];
  autocomplete?: Function;
  reply?: boolean;
  delete?: boolean;
}

export type FileData = {
  filePath: string;
  fileContents: any;
};

export enum CommandType {
  SLASH = "SLASH",
  LEGACY = "LEGACY",
  BOTH = "BOTH",
}

export enum CooldownTypes {
  perUser = "perUser",
  perUserPerGuild = "perUserPerGuild",
  perGuild = "perGuild",
  global = "global",
}

export enum DefaultCommands {
  ChannelCommand = "channelcommand",
  CustomCommand = "customcommand",
  Prefix = "prefix",
  RequiredPermissions = "requiredpermissions",
  RequiredRoles = "requiredroles",
  ToggleCommand = "togglecommand",
}
