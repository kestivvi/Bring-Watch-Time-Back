import { MessageType } from "./message";

chrome.runtime.onMessage.addListener((message, sender) => {
  const url = sender.url

  switch (message.type) {
    case MessageType.PAUSE:
      console.log("PAUSE", url, message.payload);
      break;
    case MessageType.PLAY:
      console.log("PLAY", url, message.payload);
      break;
    default:
      console.error("NOT IMPLEMENTED", url, message);
      break;
  }

})

chrome.tabs.onRemoved.addListener(async (tabId, removed) => {
  // It does not work, because tab was already deleted, we need local copy xd
  // const tab = await chrome.tabs.get(tabId)
  // const url = tab.url

  console.log("TAB_CLOSED", tabId)
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
