import { bingoCardStore } from "@/domains/BingoCard/infrastructures/infrastructures/IMBingoCardStore";
import { BingoGame, BingoGameDto } from "../models/BingoGame";
import { BingoGameRepository } from "../usecases/BingoGame.repository";
import {
  BingoGameQuery,
  BingoGameDtoWithCards,
} from "../usecases/BingoGame.query";
import { bingoGameStore } from "./IMBIngoGameStore";

export class InMemoryBingoGameQuery implements BingoGameQuery {
  async findOneByIdWithCards(
    bingoGameId: string
  ): Promise<BingoGameDtoWithCards | null> {
    const bingoGame = bingoGameStore.get(bingoGameId);

    if (!bingoGame) {
      return null;
    }

    const bingoCards = Array.from(bingoCardStore.values()).filter((bingoCard) =>
      bingoGame?.bingoCardIds.includes(bingoCard.id)
    );

    const bingoCardIdMap = Object.fromEntries(
      bingoCards.map((bingoCard) => [bingoCard.id, bingoCard])
    );

    const {
      bingoCardIds,
      hashedManagementPassword,
      ...bingoGameDtoWithoutBingoCardIds
    } = bingoGame;

    return {
      ...bingoGameDtoWithoutBingoCardIds,
      bingoCards: bingoGame.bingoCardIds.map(
        (bingoCardId) => bingoCardIdMap[bingoCardId]
      ),
    };
  }
}
