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
