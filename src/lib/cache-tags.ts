export const CACHE_TAGS = {
	lotteryNumber: (bingoGameId: string) => `${bingoGameId}-lottery-number`,
	soundSetting: (bingoGameId: string) => `${bingoGameId}-sound-setting`,
} as const;
