import { BingoGameDtoWithCards, BingoGameQuery } from './BingoGame.query';

export class BingoGameFindOneWithCardsQueryUsecase {
  constructor(private readonly bingoGameQuery: BingoGameQuery) {}

  async execute(bingoGameId: string): Promise<BingoGameDtoWithCards> {
    console.log(bingoGameId);
    const bingoGame =
      await this.bingoGameQuery.findOneByIdWithCards(bingoGameId);
    if (!bingoGame) {
      throw new Error('ビンゴゲームが見つかりません');
    }

    return bingoGame;
  }
}
