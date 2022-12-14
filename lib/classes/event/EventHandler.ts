import { Client, Interaction, InteractionType, Message } from "discord.js";
import ACH from "../../main.js";
import path from "path";
import getAllFiles from "../../utils/get-all-files.js";
import { Events } from "../../typings/index.js";

export default class EventHandler {
  // <eventName, array of [function, dynamic validation functions]>
  private _eventCallbacks = new Map();
  private _instance: ACH;
  private _eventsDir: string;
  private _client: Client;
  private _events: Events;
  private _builtInEvents: any;

  constructor(instance: ACH, events: Events, client: Client) {
    this._instance = instance;
    this._eventsDir = events?.dir;
    this._events = events;
    this._client = client;

    this._builtInEvents = {
      interactionCreate: {
        isButton: (interaction: Interaction) => interaction.isButton(),
        isCommand: (interaction: Interaction) =>
          interaction.type === InteractionType.ApplicationCommand,
        isAutocomplete: (interaction: Interaction) =>
          interaction.type === InteractionType.ApplicationCommandAutocomplete,
      },
      messageCreate: {
        isHuman: (message: Message) => !message.author.bot,
      },
    };

    this.readFiles();
    this.registerEvents();
  }

  /**
   * Reads all the files in the events directory and stores them in a map
   * Default events are stored in the internal/events folder
   */
  public async readFiles() {
    const defaultEvents = getAllFiles(
      path.join(__dirname, "../../internal/events"),
      true
    );
    const folders = this._eventsDir ? getAllFiles(this._eventsDir, true) : [];

    for (const { filePath: folderPath } of [...defaultEvents, ...folders]) {
      const event = folderPath.split(/[\/\\]/g).pop()!;
      const files = getAllFiles(folderPath);

      const functions = this._eventCallbacks.get(event) || [];

      for (const { filePath, fileContents } of files) {
        const isBuiltIn = !folderPath.includes(this._eventsDir);
        const result = [fileContents];

        const split = filePath.split(event)[1].split(/[\/\\]/g);
        const methodName = split[split.length - 2];

        if (
          isBuiltIn &&
          this._builtInEvents[event] &&
          this._builtInEvents[event][methodName]
        ) {
          result.push(this._builtInEvents[event][methodName]);
        } else if (this._events[event] && this._events[event][methodName]) {
          result.push(this._events[event][methodName]);
        }

        functions.push(result);
      }

      this._eventCallbacks.set(event, functions);
    }
  }

  public registerEvents() {
    const instance = this._instance;

    for (const eventName of this._eventCallbacks.keys()) {
      const functions = this._eventCallbacks.get(eventName);

      this._client.on(eventName, async function () {
        for (const [func, dynamicValidation] of functions) {
          if (dynamicValidation && !(await dynamicValidation(...arguments))) {
            continue;
          }

          func(...arguments, instance);
        }
      });
    }
  }
}
