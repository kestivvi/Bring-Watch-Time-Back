import { LocalStorageManager } from "./LocalStorageManager";


export interface ActionData {
    timestamp: number;
    type: "PLAY" | "PAUSE";
    url: string;
}


export class ActionStorage {
    private static identifier = "ACTION";
    private storageManager: LocalStorageManager<ActionData>;

    constructor() {
        this.storageManager = new LocalStorageManager<ActionData>(ActionStorage.identifier);
    }

    public async get(eventId: number): Promise<ActionData | null> {
        return this.storageManager.getEntry(`${eventId}`);
    }

    public async push(event: ActionData): Promise<void> {
        const key = `${Date.now()}`;
        await this.storageManager.setEntry(key, event);
    }

    public async delete(eventId: number): Promise<void> {
        await this.storageManager.removeEntry(`${eventId}`);
    }

    public async getAll(): Promise<ActionData[]> {
        return this.storageManager.getAllEntries();
    }

    public async getAllFromLastMinutes(minutes: number): Promise<ActionData[]> {
        const allEvents = await this.getAll();
        const now = Date.now();
        const timeThreshold = now - minutes * 60 * 1000;
        const eventsFromLastMinutes = allEvents.filter((event) => event.timestamp >= timeThreshold);
        return eventsFromLastMinutes;
    }
}
