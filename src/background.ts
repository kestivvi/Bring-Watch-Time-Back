import { onPause, onPlay } from "./events";
import { MessageType } from "./message";

// TODO: Global variable is bad practise, I propose moving to Redux Toolkit in future
// Global Store
const tabs = new Map<number, chrome.tabs.Tab>()

chrome.runtime.onMessage.addListener((message, sender) => {

  // Variables definition
  const url = sender.url
  const tab = sender.tab


  // Null checks and early returns
  if (url === undefined) {
    console.error("URL is undefined", message, sender)
    return;
  }

  if (tab === undefined) {
    console.error("Tab is undefined", message, sender)
    return;
  }

  if (tab.id === undefined) {
    console.error("TabId is undefined", message, sender)
    return;
  }


  // Dispatcher via switch statement
  switch (message.type) {

    case MessageType.PLAY:
      tabs.set(tab.id, tab)
      onPlay(message.payload, url)
      break;

    case MessageType.PAUSE:
      onPause(message.payload, url)
      break;

    default:
      console.error("NOT IMPLEMENTED", url, message);
      break;

  }
})

chrome.tabs.onRemoved.addListener(async (tabId, removed) => {

  const tab = tabs.get(tabId)
  console.log("TAB_CLOSED", tab)

  if (tab === undefined) {
    console.error("Tab is undefined!")
    return
  }

  if (tab.url === undefined) {
    console.error("Tab URL is undefined!")
    return
  }

  onPause({ tabClosed: true }, tab.url)
  tabs.delete(tabId)
})

chrome.windows.onRemoved.addListener(async (windowId) => {
  console.log("WINDOW_CLOSED", windowId)
})

// import { MessageType } from "./message";

// chrome.tabs.onUpdated.addListener((tabId, tab) => {
//   if (tab.url && tab.url.includes("youtube.com/watch")) {
//     const queryParameters = tab.url.split("?")[1];
//     const urlParameters = new URLSearchParams(queryParameters);

//     console.log("query", queryParameters, urlParameters);

//     chrome.tabs.sendMessage(tabId, {
//       type: MessageType.URL_CHANGED,
//       videoId: urlParameters.get("v"),
//     });
//   }
// });
