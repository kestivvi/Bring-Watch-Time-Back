export const convertTimeStampToDateString = (timestamp: number): string => {

    if (Number.isNaN(timestamp)) return "";

    const dateObj = new Date(timestamp);

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    const humanReadableDate = `${year}-${month}-${day} ${hours}:${minutes}`;
    return humanReadableDate
}
