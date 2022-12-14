import ACH from "../../main.js";
import { CommandObject } from "../../typings/index.js";

export default class Command {
  private _instance: ACH;
  private _commandName: string;
  private _commandObject: CommandObject;

  constructor(
    instance: ACH,
    commandName: string,
    commandObject: CommandObject
  ) {
    this._instance = instance;
    this._commandName = commandName.toLowerCase();
    this._commandObject = commandObject;
  }

  public get instance() {
    return this._instance;
  }

  public get commandName() {
    return this._commandName;
  }

  public get commandObject() {
    return this._commandObject;
  }
}
