export interface EventData {
    timestamp: number;
    type: "PLAY" | "PAUSE";
    url: string;
}

// Function to get an event from storage.
export const getEventFromStorage = async (eventId: number): Promise<EventData | null> => {
    const result = await chrome.storage.local.get("event" + eventId.toString());
    const event = result["event" + eventId.toString()] as EventData;
    return event || null;
};

// Function to set an event in storage.
export const setEventToStorage = async (event: EventData): Promise<void> => {
    const key = "event" + Date.now().toString(); // Use the timestamp as the key for unique storage
    const dataToStore = {
        [key]: event,
    };
    await chrome.storage.local.set(dataToStore);
};

// Function to delete an event from storage.
export const deleteEventFromStorage = async (eventId: number): Promise<void> => {
    await chrome.storage.local.remove("event" + eventId.toString());
};

// Function to get all events from storage.
export const getAllEventsFromStorage = async (): Promise<EventData[]> => {
    const result = await chrome.storage.local.get(null);
    const events: EventData[] = [];

    for (const key in result) {
        if (key.startsWith("event")) {
            events.push(result[key] as EventData);
        }
    }

    return events;
};


// Function to get all events from the last X minutes.
export const getAllEventsFromLastMinutes = async (minutes: number): Promise<EventData[]> => {
    const allEvents = await getAllEventsFromStorage();
    const now = Date.now();
    const timeThreshold = now - minutes * 60 * 1000;
    const eventsFromLastMinutes = allEvents.filter(event => event.timestamp >= timeThreshold);
    return eventsFromLastMinutes;
};
