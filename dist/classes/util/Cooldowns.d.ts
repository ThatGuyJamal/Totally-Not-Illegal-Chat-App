import { Collection } from "discord.js";
import { CooldownConfig, CooldownTypes, InternalCooldownConfig } from "../../typings";
import ACH from "../../main";
export declare class Cooldowns {
    _cooldowns: Collection<string, Date>;
    _instance: ACH;
    private _errorMessage;
    private _botOwnersBypass;
    private _dbRequired;
    constructor(instance: ACH, cooldownConfig: CooldownConfig);
    private loadCooldowns;
    getKeyFromCooldownUsage(cooldownUsage: InternalCooldownConfig): string;
    cancelCooldown(cooldownUsage: InternalCooldownConfig): Promise<void>;
    updateCooldown(cooldownUsage: InternalCooldownConfig, expires: Date): Promise<void>;
    verifyCooldown(duration: number | string): number;
    getKey(cooldownType: CooldownTypes, userId: string, actionId: string, guildId?: string): string;
    canBypass(userId: string): boolean;
    start(cooldownUsage: InternalCooldownConfig): Promise<void>;
    canRunAction(cooldownUsage: InternalCooldownConfig): string | true;
}
//# sourceMappingURL=Cooldowns.d.ts.map