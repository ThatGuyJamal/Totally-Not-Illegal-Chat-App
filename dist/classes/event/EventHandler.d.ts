import { Client } from "discord.js";
import ACH from "../../main";
import { Events } from "../../typings";
export default class EventHandler {
    private _eventCallbacks;
    private _instance;
    private _eventsDir;
    private _client;
    private _events;
    private _builtInEvents;
    constructor(instance: ACH, events: Events, client: Client);
    /**
     * Reads all the files in the events directory and stores them in a map
     * Default events are stored in the internal/events folder
     */
    readFiles(): Promise<void>;
    registerEvents(): void;
}
//# sourceMappingURL=EventHandler.d.ts.map