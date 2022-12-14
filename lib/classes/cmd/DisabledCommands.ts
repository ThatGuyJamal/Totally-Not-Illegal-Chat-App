import disabledCommandSchema from "../../models/disabled-commands-schema.js";
import ACH from "../../main.js";

export default class DisabledCommands {
  // array of `${guildId}-${commandName}`
  public _disabledCommands: string[] = [];
  private _instance: ACH;

  public constructor(instance: ACH) {
    this._instance = instance;

    this.loadDisabledCommands();
  }

  public async loadDisabledCommands() {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const results = await disabledCommandSchema.find({});

    for (const result of results) {
      this._disabledCommands.push(result._id);
    }
  }

  public async disable(guildId: string, commandName: string) {
    if (
      !this._instance.isConnectedToDB ||
      this.isDisabled(guildId, commandName)
    ) {
      return;
    }

    const _id = `${guildId}-${commandName}`;
    this._disabledCommands.push(_id);

    try {
      await new disabledCommandSchema({
        _id,
      }).save();
    } catch (ignored) {}
  }

  public async enable(guildId: string, commandName: string) {
    if (
      !this._instance.isConnectedToDB ||
      !this.isDisabled(guildId, commandName)
    ) {
      return;
    }

    const _id = `${guildId}-${commandName}`;
    this._disabledCommands = this._disabledCommands.filter((id) => id !== _id);

    await disabledCommandSchema.deleteOne({ _id });
  }

  public isDisabled(guildId: string, commandName: string) {
    return this._disabledCommands.includes(`${guildId}-${commandName}`);
  }
}
