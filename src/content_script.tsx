import { MessageType } from "./background/message";

type State = {
  type: "PLAYING" | "PAUSED" | null,
  time: number | null,
  video: HTMLVideoElement | null,
  url: string | null,
}

const timeDelta = 2000

let state: State = {
  type: null,
  time: null,
  video: null,
  url: null,
}


const onPlay = () => {
  chrome.runtime.sendMessage({ type: MessageType.PLAY })
};


const onPause = () => {
  chrome.runtime.sendMessage({ type: MessageType.PAUSE })
};


const check = () => {
  if (state.type === null) {
    console.error("BWTB Impossible");
  } else if (state.type === "PLAYING") {
    if (state.time && Date.now() - state.time > 0.8 * timeDelta) {
      state.type = "PAUSED"
      onPause()
    }
  } else if (state.type === "PAUSED") { }
}


const onTimeUpdate = () => {

  if (state.type === "PLAYING") {
    if (state.time && Date.now() - state.time > timeDelta) {
      onPlay()
    }
  } else if (state.type === "PAUSED" || state.type === null) {
    onPlay()
  }

  state.type = "PLAYING"
  state.time = Date.now()
  setTimeout(check, timeDelta)
}

const quickPause = () => {
  state.type = "PAUSED"
  onPause()
}


const setupVideo = () => {
  const video = document.getElementsByTagName("video")[0];

  video.addEventListener("timeupdate", onTimeUpdate);
  video.addEventListener("play", onTimeUpdate);
  video.addEventListener("pause", quickPause);

  state.video = video;

  return video
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "PAGE_LOAD_COMPLETE") {
    if (state.url !== message.url) {

      state.video?.removeEventListener("timeupdate", onTimeUpdate);
      state.video?.removeEventListener("play", onTimeUpdate);
      state.video?.removeEventListener("pause", quickPause);

      state.url = message.url
      setupVideo()
    }
  }
})
