// Function to get a tab from storage.
export const getTabFromStorage = async (tabId: number): Promise<chrome.tabs.Tab | null> => {
    const result = await chrome.storage.local.get(tabId.toString());
    const tab = result[tabId.toString()] as chrome.tabs.Tab;
    return tab || null;
};

// Function to set a tab in storage.
export const setTabToStorage = async (tab: chrome.tabs.Tab): Promise<void> => {
    if (!tab.id) return;
    const key = tab.id.toString();
    const dataToStore = {
        [key]: JSON.parse(JSON.stringify(tab)),
    };
    await chrome.storage.local.set(dataToStore);
};

// Function to delete a tab from storage.
export const deleteTabFromStorage = async (tabId: number): Promise<void> => {
    await chrome.storage.local.remove(tabId.toString());
};
