export class LocalStorageManager<T> {
    private identifier: string;

    constructor(identifier: string) {
        this.identifier = identifier;
    }

    private getKeyWithPrefix(key: string): string {
        return `${this.identifier}_${key}`;
    }

    private async filterDataByPredicate<U>(
        predicate: (key: string, data: U) => boolean
    ): Promise<U[]> {
        const result = await chrome.storage.local.get(null);
        const filteredData: U[] = [];

        for (const key in result) {
            if (key.startsWith(this.identifier + "_")) {
                const data = result[key] as U;
                if (data && predicate(key, data)) {
                    filteredData.push(data);
                }
            }
        }

        return filteredData;
    }

    public async getEntry(key: string): Promise<T | null> {
        const prefixedKey = this.getKeyWithPrefix(key);
        const result = await chrome.storage.local.get(prefixedKey);
        const data = result[prefixedKey] as T;
        return data || null;
    }

    public async getAllEntries(): Promise<T[]> {
        return this.filterDataByPredicate<T>(() => true);
    }

    public async getEntriesWithKeyContaining(substring: string): Promise<T[]> {
        return this.filterDataByPredicate<T>((key) => key.includes(substring));
    }

    public async setEntry(key: string, data: T): Promise<void> {
        const prefixedKey = this.getKeyWithPrefix(key);
        const dataToStore = { [prefixedKey]: data };
        await chrome.storage.local.set(dataToStore);
    }

    public async removeEntry(key: string): Promise<void> {
        const prefixedKey = this.getKeyWithPrefix(key);
        await chrome.storage.local.remove(prefixedKey);
    }
}
