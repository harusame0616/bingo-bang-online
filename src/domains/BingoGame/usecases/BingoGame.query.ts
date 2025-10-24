import type { BingoCardDto } from "@/domains/BingoCard/models/BingoCard";

import type { BingoGameDto } from "../models/BingoGame";

export type BingoGameViewDtoWithCards = Omit<
	BingoGameDto,
	"bingoCardIds" | "id"
> & {
	bingoCards: Omit<BingoCardDto, "bingoGameId">[];
};

export type BingoGameDtoWithCards = Omit<BingoGameDto, "bingoCardIds"> & {
	bingoCards: BingoCardDto[];
};

export interface BingoGameQuery {
	findOneByViewIdWithCards: (
		bingoGameId: string,
	) => Promise<BingoGameViewDtoWithCards>;

	findOneByIdWithCards: (
		bingoGameId: string,
	) => Promise<BingoGameDtoWithCards | null>;
}
