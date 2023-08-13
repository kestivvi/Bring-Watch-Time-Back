import { useState, useRef, useEffect } from "react"
import { ActionStorage } from "../../background/ActionStorage"
import { VideoInfo, getVideoIdFromURL, VideoInfoStorage } from '../../background/VideoInfoStorage';

export type EventOptions = {
    negligibleGap: number // miliseconds
}

export type Event = {
    start_timestamp: number,
    end_timestamp: number,
    video_info: VideoInfo
}

export function useEvents({ negligibleGap }: EventOptions) {
    const [events, setEvents] = useState<Event[]>([])

    const actionStorage = useRef(new ActionStorage())
    const videoInfoStorage = useRef(new VideoInfoStorage())

    useEffect(() => {

        const fetchActionsAndProcess = async () => {
            const actions = await actionStorage.current.getAll();

            const grouppedActions = groupBy(actions, (action) => action.url)

            let events: Event[] = []

            for (const value of Object.keys(grouppedActions)) {
                console.log("for", value, grouppedActions)
                if (grouppedActions[value] === undefined) continue

                grouppedActions[value].sort((a, b) => a.timestamp - b.timestamp)

                // TODO: Make sure that actions are in groups Play Pause
                const doubleGrouppedActions = chunk(grouppedActions[value], 2)

                const eventPromises = doubleGrouppedActions.filter((value) => {
                    const [play, pause] = value;
                    if (pause === undefined || play === undefined) return false
                    return pause.timestamp - play.timestamp > negligibleGap;
                }).map(async (value) => {
                    const [play, pause] = value;
                    const videoId = getVideoIdFromURL(play.url);
                    let videoInfo = await videoInfoStorage.current.get(videoId);
                    if (videoInfo === null) {
                        videoInfo = {
                            videoId,
                            title: videoId,
                            channel_name: "UNKNOWN",
                            channel_url: "UNKNOWN"
                        };
                    }
                    const result: Event = {
                        start_timestamp: play.timestamp,
                        end_timestamp: pause.timestamp,
                        video_info: videoInfo,
                    }
                    return result;
                })


                const toPush = await Promise.all(eventPromises)
                events.push(...toPush)
                console.log("events from for", events)
            }

            console.log("useEvents events", events)
            setEvents(() => events);
        };

        fetchActionsAndProcess();

        const handleStorageChange = (changes: { [key: string]: chrome.storage.StorageChange }) => {
            // Check if any event related to "event" key has changed
            fetchActionsAndProcess();
        };

        // Set up the listener
        chrome.storage.onChanged.addListener(handleStorageChange);

        // Clean up the listener when the component unmounts
        return () => {
            chrome.storage.onChanged.removeListener(handleStorageChange);
        };

    }, [])

    return events
}

function groupBy<T>(arr: T[], fn: (item: T) => any) {
    return arr.reduce<Record<string, T[]>>((prev, curr) => {
        const groupKey = fn(curr);
        const group = prev[groupKey] || [];
        group.push(curr);
        return { ...prev, [groupKey]: group };
    }, {});
}

export const chunk = <T>(arr: T[], size: number) =>
    Array.from({ length: Math.ceil(arr.length / size) }, (_: T, i: number) =>
        arr.slice(i * size, i * size + size)
    );
