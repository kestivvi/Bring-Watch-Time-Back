export const hookToVideoElement = (
    onTimeUpdate: (this: HTMLVideoElement, ev: Event) => any,
    onPlay: (this: HTMLVideoElement, ev: Event) => any,
    onPause: (this: HTMLVideoElement, ev: Event) => any,
): HTMLVideoElement => {
    const video = document.getElementsByTagName("video")[0];

    video.addEventListener("timeupdate", onTimeUpdate);
    video.addEventListener("play", onPlay);
    video.addEventListener("pause", onPause);

    return video
}

