import { InteractionType } from "discord.js";
import getAllFiles from "../../utils/get-all-files.js";
import path from "node:path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export default class EventHandler {
    // <eventName, array of [function, dynamic validation functions]>
    _eventCallbacks = new Map();
    _instance;
    _eventsDir;
    _client;
    _events;
    _builtInEvents;
    constructor(instance, events, client) {
        this._instance = instance;
        this._eventsDir = events?.dir;
        this._events = events;
        this._client = client;
        this._builtInEvents = {
            interactionCreate: {
                isButton: (interaction) => interaction.isButton(),
                isCommand: (interaction) => interaction.type === InteractionType.ApplicationCommand,
                isAutocomplete: (interaction) => interaction.type === InteractionType.ApplicationCommandAutocomplete,
            },
            messageCreate: {
                isHuman: (message) => !message.author.bot,
            },
        };
        this.readFiles();
        this.registerEvents();
    }
    /**
     * Reads all the files in the events directory and stores them in a map
     * Default events are stored in the internal/events folder
     */
    async readFiles() {
        const defaultEvents = getAllFiles(path.join(__dirname, "../../internal/events"), true);
        const folders = this._eventsDir ? getAllFiles(this._eventsDir, true) : [];
        for (const { filePath: folderPath } of [...defaultEvents, ...folders]) {
            const event = folderPath.split(/[\/\\]/g).pop();
            const files = getAllFiles(folderPath);
            const functions = this._eventCallbacks.get(event) || [];
            for (const { filePath, fileContents } of files) {
                const isBuiltIn = !folderPath.includes(this._eventsDir);
                const result = [fileContents];
                const split = filePath.split(event)[1].split(/[\/\\]/g);
                const methodName = split[split.length - 2];
                if (isBuiltIn &&
                    this._builtInEvents[event] &&
                    this._builtInEvents[event][methodName]) {
                    result.push(this._builtInEvents[event][methodName]);
                }
                else if (this._events[event] && this._events[event][methodName]) {
                    result.push(this._events[event][methodName]);
                }
                functions.push(result);
            }
            this._eventCallbacks.set(event, functions);
        }
    }
    registerEvents() {
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
