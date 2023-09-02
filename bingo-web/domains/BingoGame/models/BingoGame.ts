const BingoGameStateEnum = {
  CREATED: 0,
  PLAYING: 1,
  FINISHED: 2,
} as const;

type BingoGameStateName = keyof typeof BingoGameStateEnum;
type BingoGameState = (typeof BingoGameStateEnum)[BingoGameStateName];

type BingoGameDto = {
  id: string;
  lotteryNumbers: number[];
  viewId: string;
  state: BingoGameState;
  hashedManagementPassword: string | null;
};

class BingoGame {
  private constructor(private dto: BingoGameDto) {}

  static createGame() {
    return new BingoGame({
      id: crypto.randomUUID(),
      lotteryNumbers: [],
      viewId: crypto.randomUUID(),
      hashedManagementPassword: null,
      state: BingoGameStateEnum.CREATED,
    });
  }

  static fromDto(dto: BingoGameDto) {
    return new BingoGame({ ...dto });
  }

  toDto() {
    return { ...this.dto };
  }
}
