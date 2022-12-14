import { Collection } from "discord.js";
import ACH from "../../main";
import channelCommands from "../../models/channel-commands-schema";

class ChannelCommands {
  // `${guildId}-${commandName}`: [channelIds]
  public _channelCommands: Collection<string, string[]> = new Collection();
  private _instance: ACH;

  public constructor(instance: ACH) {
    this._instance = instance;
  }

  public async action(
    action: "add" | "remove",
    guildId: string,
    commandName: string,
    channelId: string
  ) {
    if (!this._instance.isConnectedToDB) {
      return;
    }

    const _id = `${guildId}-${commandName}`;

    const result = await channelCommands.findOneAndUpdate(
      {
        _id,
      },
      {
        _id,
        [action === "add" ? "$addToSet" : "$pull"]: {
          channels: channelId,
        },
      },
      {
        upsert: true,
        new: true,
      }
    );

    this._channelCommands.set(_id, result.channels);
    return result.channels;
  }

  /**
   * Adds a command to the channel only command list
   * @param guildId
   * @param commandName
   * @param channelId
   * @returns
   */
  public async add(guildId: string, commandName: string, channelId: string) {
    return await this.action("add", guildId, commandName, channelId);
  }

  public async remove(guildId: string, commandName: string, channelId: string) {
    return await this.action("remove", guildId, commandName, channelId);
  }

  public async getAvailableChannels(guildId: string, commandName: string) {
    if (!this._instance.isConnectedToDB) {
      return [];
    }

    const _id = `${guildId}-${commandName}`;
    let channels = this._channelCommands.get(_id);

    if (!channels) {
      const results = await channelCommands.findById(_id);
      channels = results ? results.channels : [];
      this._channelCommands.set(_id, channels!);
    }

    return channels || [];
  }
}

export default ChannelCommands;
