import { MessageType } from "../background/message"
import { State } from "./state"

// TODO: Extract to config
const timeDelta = 1000 // ms

export const onTimeUpdate = (state: State, video: HTMLVideoElement) => {
    check(state, video)
}

export const onPlay = (state: State, video: HTMLVideoElement) => {
    check(state, video)
}

export const onPause = (state: State, video: HTMLVideoElement) => {
    check(state, video)
}

export const onUrlChangedEvent = (state: State, oldUrl: string, newUrl: string) => {
    if (!newUrl.includes("watch")) {
        state.block_timestamp = Date.now()
    }

    if (state.type !== "PAUSED") {
        state.type = "PAUSED"
        sendPause(oldUrl)
    }
}

const check = (state: State, video: HTMLVideoElement) => {

    if (state.block_timestamp && state.block_time && Date.now() - state.block_time < state.block_timestamp) {
        return
    }

    if (state.type === "PLAYING" && state.time && Date.now() - state.time > timeDelta) {
        sendPlay(state.url || undefined)
    } else if (state.type === "PAUSED" || state.type === null) {
        sendPlay(state.url || undefined)
    }

    state.type = "PLAYING"
    state.time = Date.now()
    setTimeout(() => recheck(state, video), timeDelta)
}

const recheck = (state: State, video: HTMLVideoElement) => {

    if (state.block_timestamp && state.block_time && Date.now() - state.block_time < state.block_timestamp) return

    if (state.type === "PLAYING" && state.time && Date.now() - state.time > 0.5 * timeDelta) {
        state.type = "PAUSED"
        sendPause(undefined)
    }
}


///////////////////////////////////////////
// Communication to the background process

const sendPlay = (url: string | undefined) => {
    chrome.runtime.sendMessage({ type: MessageType.PLAY, payload: { url } })
};


const sendPause = (url: string | undefined) => {
    chrome.runtime.sendMessage({ type: MessageType.PAUSE, payload: { url } })
};
