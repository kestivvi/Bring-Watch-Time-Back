import { onPause, onPlay } from "./events"
import { MessageType } from "./message"
import { getTabFromStorage, setTabToStorage, deleteTabFromStorage } from "./tabs_storage"


// Handling messages from the content scripts
const onMessageHandler = (
    message: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response?: any) => void,
): void => {

    const url = sender.tab?.url


    // Null checks and early returns
    if (url === undefined) {
        console.error("URL is undefined", message, sender)
        return;
    }


    // Dispatcher via switch statement
    switch (message.type) {

        case MessageType.PLAY:
            onPlay(message.payload, url)
            break;

        case MessageType.PAUSE:
            onPause(message.payload, url)
            break;

        default:
            console.error("NOT IMPLEMENTED", url, message);
            break;

    }
}


// Chrome API handlers
const onUpdatedTabHandler = (
    tabId: number,
    changeInfo: chrome.tabs.TabChangeInfo,
    tab: chrome.tabs.Tab,
): void => {
    setTabToStorage(tab)

    if (changeInfo.status === 'complete') {
        chrome.tabs.sendMessage(tabId, {
            type: 'PAGE_LOAD_COMPLETE',
            url: tab.url
        })
    }

}



const onRemovedTabHandler = async (
    tabId: number,
    removeInfo: chrome.tabs.TabRemoveInfo
): Promise<void> => {

    const tab = await getTabFromStorage(tabId)

    if (tab === null) {
        console.error("Tab is undefined!")
        return
    }

    if (tab.url === undefined) {
        console.error("Tab URL is undefined!")
        return
    }

    onPause({ tabClosed: true }, tab.url)
    deleteTabFromStorage(tabId)
}



const onRemovedWindowHandler = (
    windowId: number
): void => {
}



export const setupEventListeners = () => {
    chrome.runtime.onMessage.addListener(onMessageHandler)
    chrome.tabs.onRemoved.addListener(onRemovedTabHandler)
    chrome.tabs.onUpdated.addListener(onUpdatedTabHandler)
    chrome.windows.onRemoved.addListener(onRemovedWindowHandler)
}
