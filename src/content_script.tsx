import { onBackgroundMessage } from "./foreground/message_listener"
import { State } from "./foreground/types"

let state: State = {
  type: null,
  time: null,
  video: null,
  url: null,
  block_timestamp: null,
  block_time: 5000,
  video_author: null,
  video_author_url: null,
  video_title: null,
}


chrome.runtime.onMessage.addListener((
  message: any,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response?: any) => void,
) => {
  onBackgroundMessage(message, sender, sendResponse, state);
})
