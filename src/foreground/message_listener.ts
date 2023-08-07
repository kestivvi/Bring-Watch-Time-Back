import { onPause, onPlay, onTimeUpdate, onUrlChangedEvent } from "./events"
import { getVideoElement, hookToVideoElement } from "./hooks"
import { State } from "./types"

export const onBackgroundMessage = (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response?: any) => void, state: State) => {

    // TODO: Make enums to use types
    switch (message.type) {
        case "PAGE_LOAD_COMPLETE":
            onPageLoadComplete(message, state)
            break

        case "URL_CHANGED":
            onUrlChanged(message, state)
            break

        default:
            break;
    }
}

const onPageLoadComplete = (message: any, state: State) => {
    console.log("onPageLoadComplete")

    if (state.url === message.url) return

    const video = getVideoElement();
    if (state.video === video) return


    function onTimeUpdateAdapter(this: HTMLVideoElement, ev: Event) { onTimeUpdate(state, this) }
    function onPlayAdapter(this: HTMLVideoElement, ev: Event) { onPlay(state, this) }
    function onPauseAdapter(this: HTMLVideoElement, ev: Event) { onPause(state, this) }

    if (state.video) {
        state.video.removeEventListener("timeupdate", onTimeUpdateAdapter)
        state.video.removeEventListener("play", onPlayAdapter)
        state.video.removeEventListener("pause", onPauseAdapter)
    }

    state.video = hookToVideoElement(
        onTimeUpdateAdapter,
        onPlayAdapter,
        onPauseAdapter,
    )
    console.log("onPageLoadComplete found video", state.video)

    console.log("onPageLoadComplete end")
}


const onUrlChanged = (message: any, state: State) => {
    console.log("onUrlChanged")
    onUrlChangedEvent(state, message.oldUrl, message.url)
    state.url = message.url
    console.log("onUrlChanged end")
}
