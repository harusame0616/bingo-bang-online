import { bingoCardStore } from '@/domains/BingoCard/infrastructures/infrastructures/IMBingoCardStore';

import {
  BingoGameDtoWithCards,
  BingoGameQuery,
} from '../usecases/BingoGame.query';
import { bingoGameStore } from './InMemoryBIngoGame.store';

export class InMemoryBingoGameQuery implements BingoGameQuery {
  async findOneByIdWithCards(
    bingoGameId: string,
  ): Promise<BingoGameDtoWithCards | null> {
    const bingoGame = bingoGameStore.get(bingoGameId);

    if (!bingoGame) {
      return null;
    }

    const bingoCards = Array.from(bingoCardStore.values()).filter(
      (card) => card.bingoGameId === bingoGameId,
    );

    const { hashedManagementPassword, ...bingoGameDtoWithoutBingoCardIds } =
      bingoGame;

    return {
      ...bingoGameDtoWithoutBingoCardIds,
      bingoCards,
    };
  }
}
