import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { ActionData, ActionStorage } from "../background/ActionStorage"
import { convertTimeStampToDateString } from "../utils/time";
import { extractYouTubeVideoId } from "./utils";
import { EventList } from "./EventList";

const Home = () => {

  const [events, setEvents] = useState<ActionData[]>([])
  const actionStorage = useRef(new ActionStorage())

  useEffect(() => {

    const fetchEvents = async () => {
      const eventsFromStorage = await actionStorage.current.getAll();
      setEvents(eventsFromStorage);
    };

    fetchEvents();

    const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
      // Check if any event related to "event" key has changed
      fetchEvents();
    };

    // Set up the listener
    chrome.storage.onChanged.addListener(handleStorageChange);

    // Clean up the listener when the component unmounts
    return () => {
      chrome.storage.onChanged.removeListener(handleStorageChange);
    };

  }, []);

  return (
    <>
      HOME

      <EventList events={events.sort((a, b) => b.timestamp - a.timestamp)} />
    </>
  );
};

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Home />
  </React.StrictMode>
);


