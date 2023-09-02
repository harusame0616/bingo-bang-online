const BingoGameStateEnum = {
  CREATED: 0,
  PLAYING: 1,
  FINISHED: 2,
} as const;

type BingoGameStateName = keyof typeof BingoGameStateEnum;
type BingoGameState = (typeof BingoGameStateEnum)[BingoGameStateName];

export type BingoGameDto = {
  id: string;
  lotteryNumbers: number[];
  viewId: string;
  state: BingoGameState;
  hashedManagementPassword: string | null;
};

export class BingoGame {
  private constructor(private dto: BingoGameDto) {}

  get id() {
    return this.dto.id;
  }

  get lotteryNumbers() {
    return [...this.dto.lotteryNumbers];
  }

  static createGame() {
    return new BingoGame({
      id: crypto.randomUUID(),
      lotteryNumbers: [],
      viewId: crypto.randomUUID(),
      hashedManagementPassword: null,
      state: BingoGameStateEnum.CREATED,
    });
  }

  drawLotteryNumber() {
    if (this.dto.lotteryNumbers.length > 75) {
      throw new Error("すべての抽選番号を抽選しました");
    }

    // 未抽選番号のリストを作成
    const notDrawnLotteryNumber = [...new Array(75)]
      .map((_, i) => i + 1)
      .filter((i) => !this.dto.lotteryNumbers.includes(i));

    // 未抽選番号の中からランダムに選択
    const lotteryNumber = Math.floor(
      Math.random() * notDrawnLotteryNumber.length
    );
    this.dto.lotteryNumbers.push(lotteryNumber);
  }

  static fromDto(dto: BingoGameDto) {
    return new BingoGame({ ...dto });
  }

  toDto() {
    return { ...this.dto };
  }
}
