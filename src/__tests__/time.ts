import { convertTimeStampToDateString } from '../utils/time';

describe('convertTimeStampToDateString', () => {

    it('should convert timestamp to a human-readable date', () => {
        const timestamp1 = new Date(2023, 6, 28, 12, 34).getTime();
        expect(convertTimeStampToDateString(timestamp1)).toBe('2023-07-28 12:34');

        const timestamp2 = new Date(2022, 1, 15, 8, 15).getTime();
        expect(convertTimeStampToDateString(timestamp2)).toBe('2022-02-15 08:15');

        const timestamp3 = new Date(2021, 8, 1).getTime();
        expect(convertTimeStampToDateString(timestamp3)).toBe('2021-09-01 00:00');
    });


    it('should handle invalid input gracefully', () => {
        const invalidTimestamp = NaN;
        expect(convertTimeStampToDateString(invalidTimestamp)).toBe('');
    });

});
