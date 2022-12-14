import ACH from "../../main";
export default class DisabledCommands {
    _disabledCommands: string[];
    private _instance;
    constructor(instance: ACH);
    loadDisabledCommands(): Promise<void>;
    disable(guildId: string, commandName: string): Promise<void>;
    enable(guildId: string, commandName: string): Promise<void>;
    isDisabled(guildId: string, commandName: string): boolean;
}
//# sourceMappingURL=DisabledCommands.d.ts.map