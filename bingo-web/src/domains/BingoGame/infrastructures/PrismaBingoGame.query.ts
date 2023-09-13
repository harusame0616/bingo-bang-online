import { prisma } from '@/lib/prisma';

import {
  BingoGameDtoWithCards,
  BingoGameQuery,
  BingoGameViewDtoWithCards,
} from '../usecases/BingoGame.query';

export class PrismaBingoGameQuery implements BingoGameQuery {
  async findOneByViewIdWithCards(
    viewId: string,
  ): Promise<BingoGameViewDtoWithCards | null> {
    const bingoGame = await prisma.bingoGameEntity.findUnique({
      where: { viewId },
    });

    if (!bingoGame) {
      return null;
    }

    const bingoCards = await prisma.bingoCardEntity.findMany({
      where: { bingoGameId: bingoGame.id },
    });

    const { id, ...bingoGameWithoutId } = bingoGame;

    return {
      ...bingoGameWithoutId,
      state: 'created',
      bingoCards:
        bingoCards?.map((card) => ({
          id: card.id,
          squares: [
            card.squares.slice(0, 5),
            card.squares.slice(5, 10),
            card.squares.slice(10, 15),
            card.squares.slice(15, 20),
            card.squares.slice(20, 25),
          ],
          name: card.name,
          bingoGameId: card.bingoGameId,
        })) || [],
    };
  }

  async findOneByIdWithCards(
    bingoGameId: string,
  ): Promise<BingoGameDtoWithCards | null> {
    const [bingoGame, bingoCards] = await Promise.all([
      prisma.bingoGameEntity.findUnique({
        where: { id: bingoGameId },
      }),
      prisma.bingoCardEntity.findMany({
        where: { bingoGameId: bingoGameId },
      }),
    ]);

    if (!bingoGame) {
      return null;
    }

    return {
      ...bingoGame,
      state: 'created',
      bingoCards:
        bingoCards?.map((card) => ({
          id: card.id,
          squares: [
            card.squares.slice(0, 5),
            card.squares.slice(5, 10),
            card.squares.slice(10, 15),
            card.squares.slice(15, 20),
            card.squares.slice(20, 25),
          ],
          name: card.name,
          bingoGameId: card.bingoGameId,
        })) || [],
    };
  }
}
