import type { BingoGameDto } from "../models/BingoGame";

declare global {
	// eslint-disable-next-line no-var
	var bingoGameStore: Map<string, BingoGameDto>;
}
if (!global.bingoGameStore) {
	global.bingoGameStore = new Map<string, BingoGameDto>();
}

// 別名でエクスポート
const store = global.bingoGameStore;
export { store as bingoGameStore };
