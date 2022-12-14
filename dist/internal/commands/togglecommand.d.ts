import { ApplicationCommandOptionType } from "discord.js";
import { CommandType, CommandUsage } from "../../typings/index.js";
import Command from "../../classes/cmd/Command.js";
declare const _default: {
    description: string;
    type: CommandType;
    guildOnly: boolean;
    permissions: bigint[];
    options: {
        name: string;
        description: string;
        type: ApplicationCommandOptionType;
        required: boolean;
        autocomplete: boolean;
    }[];
    autocomplete: (command: Command) => string[];
    callback: (commandUsage: CommandUsage) => Promise<{
        content: string;
        ephemeral: boolean;
    }>;
};
export default _default;
//# sourceMappingURL=togglecommand.d.ts.map