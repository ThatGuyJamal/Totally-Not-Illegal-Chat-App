import ACH from "../../main.js";
import { CommandObject } from "../../typings/index.js";
export default class Command {
    private _instance;
    private _commandName;
    private _commandObject;
    constructor(instance: ACH, commandName: string, commandObject: CommandObject);
    get instance(): ACH;
    get commandName(): string;
    get commandObject(): CommandObject;
}
//# sourceMappingURL=Command.d.ts.map