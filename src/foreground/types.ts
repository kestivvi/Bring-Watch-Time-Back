export type State = {
    type: "PLAYING" | "PAUSED" | null,
    time: number | null,
    video: HTMLVideoElement | null,
    url: string | null,
}
