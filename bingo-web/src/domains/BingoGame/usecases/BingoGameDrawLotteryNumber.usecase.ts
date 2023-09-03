import { BingoGame, BingoGameDto } from "../models/BingoGame";
import { BingoGameRepository } from "./BingoGameRepository";

type BingoGameDrawLotteryNumberDto = Omit<
  BingoGameDto,
  "hashedManagementPassword"
>;

export class BingoGameDrawLotteryNumberUsecase {
  constructor(private readonly bingoGameRepository: BingoGameRepository) {}

  async execute(bingoGameId: string): Promise<BingoGameDrawLotteryNumberDto> {
    const bingoGame = await this.bingoGameRepository.findOneById(bingoGameId);
    if (!bingoGame) {
      throw new Error("ビンゴゲームが見つかりません");
    }

    bingoGame.drawLotteryNumber();

    await this.bingoGameRepository.save(bingoGame);

    const { hashedManagementPassword, ...bingoGameDrawLotteryNumberDto } =
      bingoGame.toDto();

    return bingoGameDrawLotteryNumberDto;
  }
}
