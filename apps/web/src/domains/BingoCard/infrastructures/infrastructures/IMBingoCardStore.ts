import type { BingoCardDto } from "../../models/BingoCard";

declare global {
	// eslint-disable-next-line no-var
	var bingoCardStore: Map<string, BingoCardDto>;
}

if (!global.bingoCardStore) {
	global.bingoCardStore = new Map<string, BingoCardDto>();
}
// biome-ignore lint/suspicious/noRedeclare: Global store requires both declaration and initialization
export const bingoCardStore = global.bingoCardStore;
