export const BINGO_CARD_MAX_COUNT = 15;

export const BingoGameStateEnum = {
  CREATED: "created",
  PLAYING: "playing",
  FINISHED: "finished",
} as const;

type BingoGameStateName = keyof typeof BingoGameStateEnum;
type BingoGameState = (typeof BingoGameStateEnum)[BingoGameStateName];

export type BingoGameDto = {
  id: string;
  lotteryNumbers: number[];
  viewId: string;
  state: BingoGameState;
  hashedManagementPassword: string | null;
  bingoCardIds: string[];
};

export class BingoGame {
  private constructor(private dto: BingoGameDto) {}

  get id() {
    return this.dto.id;
  }

  get lotteryNumbers() {
    return [...this.dto.lotteryNumbers];
  }

  get bingoCardIds() {
    return [...this.dto.bingoCardIds];
  }

  static createGame() {
    return new BingoGame({
      id: crypto.randomUUID(),
      lotteryNumbers: [],
      viewId: crypto.randomUUID(),
      hashedManagementPassword: null,
      state: BingoGameStateEnum.CREATED,
      bingoCardIds: [],
    });
  }

  drawLotteryNumber() {
    if (this.dto.lotteryNumbers.length >= 75) {
      throw new Error("すべての抽選番号を抽選しました");
    }

    // 未抽選番号のリストを作成
    const notDrawnLotteryNumber = [...new Array(75)]
      .map((_, i) => i + 1)
      .filter((i) => !this.dto.lotteryNumbers.includes(i));

    // 未抽選番号の中からランダムに選択
    const lotteryNumber =
      notDrawnLotteryNumber[
        Math.floor(Math.random() * notDrawnLotteryNumber.length)
      ];
    this.dto.lotteryNumbers.push(lotteryNumber);
    this.dto.state =
      this.dto.lotteryNumbers.length === 75
        ? BingoGameStateEnum.FINISHED
        : BingoGameStateEnum.PLAYING;
  }

  registerBingoCard(bingoCardId: string) {
    const newBingoCardIds = Array.from(
      new Set([...this.dto.bingoCardIds, bingoCardId])
    );

    if (newBingoCardIds.length > BINGO_CARD_MAX_COUNT) {
      throw new Error(
        `ビンゴカードは ${BINGO_CARD_MAX_COUNT} 枚までしか登録できません`
      );
    }

    this.dto.bingoCardIds = newBingoCardIds;
  }

  static fromDto(dto: BingoGameDto) {
    return new BingoGame({ ...dto });
  }

  toDto() {
    return {
      ...this.dto,
      bingoCardIds: [...this.dto.bingoCardIds],
    };
  }
}
