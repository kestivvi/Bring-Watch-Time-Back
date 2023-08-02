import { MessageType } from "../background/message"
import { State } from "./types"

// TODO: Extract to config
const timeDelta = 1000 // ms

export const onTimeUpdate = (state: State, video: HTMLVideoElement) => {
    check(state, video)
    console.log("onTimeUpdate")
}

export const onPlay = (state: State, video: HTMLVideoElement) => {
    check(state, video)
    console.log("onPlay")
}

export const onPause = (state: State, video: HTMLVideoElement) => {
    check(state, video)
    console.log("onPause")
}

export const onUrlChangedEvent = (state: State, video: HTMLVideoElement) => {
    state.type = "PAUSED"
    sendPause(state.url || undefined)
}

const check = (state: State, video: HTMLVideoElement) => {

    // if (video.paused === true) return

    if (state.type === "PLAYING" && state.time && Date.now() - state.time > timeDelta) {
        sendPlay()
    } else if (state.type === "PAUSED" || state.type === null) {
        sendPlay()
    }

    state.type = "PLAYING"
    state.time = Date.now()
    setTimeout(() => recheck(state, video), timeDelta)
}

const recheck = (state: State, video: HTMLVideoElement) => {
    if (state.type === "PLAYING" && state.time && Date.now() - state.time > 0.5 * timeDelta) {
        state.type = "PAUSED"
        sendPause(undefined)
    }
}


///////////////////////////////////////////
// Communication to the background process

const sendPlay = () => {
    chrome.runtime.sendMessage({ type: MessageType.PLAY })
};


const sendPause = (url: string | undefined) => {
    chrome.runtime.sendMessage({ type: MessageType.PAUSE, payload: { url } })
};
