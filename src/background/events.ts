import { ActionStorage } from "./ActionStorage";

const actionStorage = new ActionStorage();

export const onPlay = (payload: {}, url: string) => {
    actionStorage.push({
        timestamp: Date.now(),
        type: "PLAY",
        url: url,
    })
}

export const onPause = (payload: {}, url: string) => {
    actionStorage.push({
        timestamp: Date.now(),
        type: "PAUSE",
        url: url,
    })
}
