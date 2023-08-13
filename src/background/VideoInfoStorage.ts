import { LocalStorageManager } from "./LocalStorageManager";

type VideoInfo = {
    videoId: string
    title: string
    channel_name: string
    channel_url: string
}


export class VideoInfoStorage {
    private static identifier = "VIDEO_INFO";
    private storageManager: LocalStorageManager<VideoInfo>;

    constructor() {
        this.storageManager = new LocalStorageManager<VideoInfo>(VideoInfoStorage.identifier);
    }

    public async get(videoId: string): Promise<VideoInfo | null> {
        return this.storageManager.getEntry(`${videoId}`);
    }

    public async push(video: VideoInfo): Promise<void> {
        const key = video.videoId;
        await this.storageManager.setEntry(key, video);
    }

    public async delete(videoId: number): Promise<void> {
        await this.storageManager.removeEntry(`${videoId}`);
    }

    public async getAll(): Promise<VideoInfo[]> {
        return this.storageManager.getAllEntries();
    }

}

export function getVideoIdFromURL(url: string): string {
    return url.split("v=")[1].split("&")[0];
}
