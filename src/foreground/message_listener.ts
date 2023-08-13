import { VideoInfoStorage, getVideoIdFromURL } from "../background/VideoInfoStorage"
import { onPause, onPlay, onTimeUpdate, onUrlChangedEvent } from "./actions"
import { getVideoElement, hookToVideoElement } from "./hooks"
import { State } from "./state"

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

const onPageLoadComplete = async (message: any, state: State) => {

    if (state.url === message.url) return

    const video = getVideoElement();
    if (state.video === video) return

    checkVideoInfo(message.url)

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
}

const onUrlChanged = (message: any, state: State) => {
    onUrlChangedEvent(state, message.oldUrl, message.url)
    state.url = message.url
}

const checkVideoInfo = async (url: string) => {
    const videoInfoStorage = new VideoInfoStorage()

    if (url === null) return
    const videoId = getVideoIdFromURL(url)

    // const video = await videoInfoStorage.get(videoId)
    // if (video !== null) return

    await waitForElm("#above-the-fold #title yt-formatted-string")

    const title = document.querySelector('#above-the-fold #title yt-formatted-string')?.textContent?.trim()
    const channel_name = document.querySelector('.ytd-channel-name #text')?.textContent?.trim()
    const channel_url = document.querySelector('.ytd-channel-name #text a')?.getAttribute("href")

    await videoInfoStorage.push({
        videoId: videoId || "",
        title: title || "",
        channel_name: channel_name || "",
        channel_url: channel_url || "",
    })
    console.log("VideoInfos end", await videoInfoStorage.getAll())
}

function waitForElm(selector: string) {
    return new Promise(resolve => {
        if (document.querySelector(selector)) {
            return resolve(document.querySelector(selector));
        }

        const observer = new MutationObserver(mutations => {
            if (document.querySelector(selector)) {
                resolve(document.querySelector(selector));
                observer.disconnect();
            }
        });

        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    });
}
