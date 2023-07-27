// Function to get a tab from storage.
export const getTabFromStorage = async (tabId: number): Promise<chrome.tabs.Tab | null> => {
    const result = await chrome.storage.local.get(tabId.toString());
    const tab = result[tabId.toString()] as chrome.tabs.Tab;
    console.log("getTabFromStorage", tab);
    return tab || null;
};

// Function to set a tab in storage.
export const setTabToStorage = async (tab: chrome.tabs.Tab): Promise<void> => {
    if (!tab.id) return;
    const key = tab.id.toString();
    const dataToStore = {
        [key]: tab,
    };
    await chrome.storage.local.set(dataToStore);
    console.log("setTabToStorage", tab);
};

// Function to delete a tab from storage.
export const deleteTabFromStorage = async (tabId: number): Promise<void> => {
    console.log("deleteTabFromStorage", getTabFromStorage(tabId));
    await chrome.storage.local.remove(tabId.toString());
};
