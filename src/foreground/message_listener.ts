import { onPause, onPlay, onTimeUpdate, onUrlChangedEvent } from "./events"
import { hookToVideoElement } from "./hooks"
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

    if (state.url === message.url) return

    function onTimeUpdateAdapter(this: HTMLVideoElement, ev: Event) { onTimeUpdate(state, this) }
    function onPlayAdapter(this: HTMLVideoElement, ev: Event) { onPlay(state, this) }
    function onPauseAdapter(this: HTMLVideoElement, ev: Event) { onPause(state, this) }

    state.video?.removeEventListener("timeupdate", onTimeUpdateAdapter)
    state.video?.removeEventListener("play", onPlayAdapter)
    state.video?.removeEventListener("pause", onPauseAdapter)

    state.url = message.url

    state.video = hookToVideoElement(
        onTimeUpdateAdapter,
        onPlayAdapter,
        onPauseAdapter,
    )

}


const onUrlChanged = (message: any, state: State) => {
    if (state.type !== "PAUSED" && state.video) {
        onUrlChangedEvent(state, state.video)
    }
}
