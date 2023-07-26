import { onPause, onPlay } from "./events"
import { MessageType } from "./message"

// TODO: Global variables do not persist. We need to use local storage
// Service workers are terminated often during browser session
const tabs = new Map<number, chrome.tabs.Tab>()

const onMessageHandler = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
): void => {

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
            // FIXME: For some reason this url becomes stale
            onPlay(message.payload, url)
            break;

        case MessageType.PAUSE:
            // FIXME: For some reason this url becomes stale
            onPause(message.payload, url)
            break;

        default:
            console.error("NOT IMPLEMENTED", url, message);
            break;

    }
}

const onRemovedTabHandler = (
    tabId: number,
    removeInfo: chrome.tabs.TabRemoveInfo
): void => {

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
}

const onRemovedWindowHandler = (
    windowId: number
): void => {
    console.log("WINDOW_CLOSED", windowId)
}

const onUpdatedTabHandler = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
): void => {
    tabs.set(tabId, tab)

    if (changeInfo.status === 'complete') {
        console.log("Page Load Complete", tab.url)
        chrome.tabs.sendMessage(tabId, {
            type: 'PAGE_LOAD_COMPLETE',
            url: tab.url
        })
    }

    if (changeInfo.url) {
        console.log("onUpdatedURL", tab.url)
        chrome.tabs.sendMessage(tabId, {
            type: 'URL_CHANGED',
        })
    }
}

export const setupEventListeners = () => {
    chrome.runtime.onMessage.addListener(onMessageHandler)
    chrome.tabs.onRemoved.addListener(onRemovedTabHandler)
    chrome.windows.onRemoved.addListener(onRemovedWindowHandler)
    chrome.tabs.onUpdated.addListener(onUpdatedTabHandler);
}
