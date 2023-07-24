import { MessageType } from "./message";

console.log("Bring watch time back loaded");

type State = {
  type: "PLAYING" | "PAUSED" | null,
  time: number | null
}

const timeDelta = 2000

let state: State = {
  type: null,
  time: null
}

const onPlay = () => {
  console.log("BWTB Odtwarzanie sie zaczeło", document.URL);
  chrome.runtime.sendMessage({ type: MessageType.PLAY, payload: `BWTB Start from ${document.URL}` })
};

const onPause = () => {
  console.log("BWTB Odtwarzanie sie spauzowało", document.URL);
  chrome.runtime.sendMessage({ type: MessageType.PAUSE, payload: `BWTB Pause from ${document.URL}` })
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


const video = document.getElementsByTagName("video")[0];
video.addEventListener("timeupdate", onTimeUpdate);
video.addEventListener("play", onTimeUpdate);
video.addEventListener("pause", () => {
  state.type = "PAUSED"
  onPause()
});

// It doesnt work :(
// document.addEventListener("onunload", (e) => {
//   e.preventDefault()
//   chrome.runtime.sendMessage({ type: "unload", payload: `BWTB unload from ${document.URL}` })
// })

// document.addEventListener("onbeforeunload", (e) => {
//   e.preventDefault()
//   chrome.runtime.sendMessage({ type: "onbeforeunload", payload: `BWTB onbeforeunload from ${document.URL}` })
// })
