import { setEventToStorage } from "./event_storage";

export const onPlay = (payload: {}, url: string) => {
    setEventToStorage({
        timestamp: Date.now(),
        type: "PLAY",
        url: url,
    })
}

export const onPause = (payload: {}, url: string) => {
    setEventToStorage({
        timestamp: Date.now(),
        type: "PAUSE",
        url: url,
    })
}
