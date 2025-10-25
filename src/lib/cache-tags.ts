export const CACHE_TAGS = {
	lotteryNumber: (bingoGameId: string) => `${bingoGameId}-lottery-number`,
	soundSetting: (bingoGameId: string) => `${bingoGameId}-sound-setting`,
	bingoCards: (bingoGameId: string) => `${bingoGameId}-bingo-cards`,
	bingoGameDelete: (bingoGameId: string) => `${bingoGameId}-bingo-game-delete`,
} as const;
