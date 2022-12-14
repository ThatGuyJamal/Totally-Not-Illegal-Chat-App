// Imported Data from packages
import {
	Client,
	ApplicationCommandOption,
	CommandInteraction,
	Guild,
	GuildMember,
	TextChannel,
	User,
} from "discord.js";

// Imported Typings
import {
	CommandType,
	CooldownTypes,
	DefaultCommands,
} from "./lib/typings/enums";

// Imported Classes
import CommandHandler from "./lib/classes/cmd/CommandHandler";
import EventHandler from "./lib/classes/events/EventHandler";

/**
 * @class
 * @version 1.0.0
 * @description The main class for Abyss Command Handler.
 */
export default class AbyssCommandHandler {
	private _client!: Client;
	private _testServers!: string[];
	public _botOwners!: string[];
	public _defaultPrefix!: string;
	public _cooldowns: Cooldowns | undefined;
	private _disabledDefaultCommands!: DefaultCommands[];
	private _validations!: Validations;
	public _commandHandler: CommandHandler | undefined;
	public _eventHandler!: EventHandler;
	private _isConnectedToDB = false;

	/**
	 * @param options The options for the client.
	 */
	constructor(options: ClientOptions);

	public get client(): Client;
	public get testServers(): string[];
	public get botOwners(): string[];
	public get cooldowns(): Cooldowns;
	public get disabledDefaultCommands(): DefaultCommands[];
	public get validations(): Validations;
	public get commandHandler(): CommandHandler;
	public get eventHandler(): EventHandler;
	public get isConnectedToDB(): boolean;
}

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

export class Cooldowns {
	constructor(instance: AbyssCommandHandler, cooldownConfig: CooldownConfig) {}
	/**
	 * Searches through the database and looks for all active cooldowns.
	 * @returns {boolean} Whether the cooldown was set or not
	 */
	private async loadCooldowns(): Promise<void>;
	public getKeyFromCooldownUsage(cooldownUsage: CooldownUsage): string;
	public async cancelCooldown(
		cooldownUsage: InternalCooldownConfig
	): Promise<void>;
	public async updateCooldown(
		cooldownUsage: InternalCooldownConfig,
		expires: Date
	): Promise<void>;
	public verifyCooldown(duration: string): number;
	public getKey(
		cooldownType: CooldownTypes,
		userId: string,
		actionId: string,
		guildId?: string
	): string;
	public canBypass(userId: string): boolean;
	public start(cooldownUsage: InternalCooldownConfig): Promise<void>;
	public canRunAction(
		cooldownUsage: InternalCooldownConfig
	): Promise<boolean | string>;
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
	cancelCooldown?: function;
	updateCooldown?: function;
}

export interface CommandObject {
	callback: function;
	type: CommandType;
	init?: function;
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
	autocomplete?: function;
	reply?: boolean;
	delete?: boolean;
}

export type FileData = {
	filePath: string;
	fileContents: any;
};

export class Command {
	constructor(
		instance: AbyssCommandHandler,
		commandName: string,
		commandObject: CommandObject
	);

	public get instance(): AbyssCommandHandler;
	public get commandName(): string;
	public get commandObject(): CommandObject;
}

export { CommandObject, Command, CommandType, CooldownTypes, DefaultCommands };
