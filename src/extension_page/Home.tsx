import React from "react";
import { EventList } from "./EventList";
import { useEvents } from "./hooks/useEvents";


export const Home = () => {

    const events = useEvents({ negligibleGap: 100 })

    return (
        <>
            HOME
            <button onClick={async () => { console.log(await chrome.storage.local.clear()) }}>Clear Local Storage</button>
            <EventList events={events.sort((a, b) => b.start_timestamp - a.start_timestamp)} />
        </>
    );
};
