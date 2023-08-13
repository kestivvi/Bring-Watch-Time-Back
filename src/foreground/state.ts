export type State = {
    type: "PLAYING" | "PAUSED" | null,
    time: number | null,
    video: HTMLVideoElement | null,
    url: string | null,
    block_timestamp: number | null,
    block_time: number | null,
    video_title: string | null,
    video_author: string | null,
    video_author_url: string | null,
}
