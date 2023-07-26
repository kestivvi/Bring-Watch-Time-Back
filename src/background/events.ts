export const onPlay = (payload: {}, url: string) => {
    console.log("PLAY", url, payload);
}

export const onPause = (payload: {}, url: string) => {
    console.log("PAUSE", url, payload);
}
