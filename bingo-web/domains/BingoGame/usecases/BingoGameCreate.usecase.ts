import { BingoGame, BingoGameDto } from "../models/BingoGame";

type BingoGameCreateDto = Omit<BingoGameDto, "hashedManagementPassword">;

export class BingoGameCreateUsecase {
  constructor(private readonly bingoGameRepository: BingoGameRepository) {}

  async execute(): Promise<BingoGameCreateDto> {
    const bingoGame = BingoGame.createGame();

    await this.bingoGameRepository.save(bingoGame);

    const { hashedManagementPassword, ...bingoGameCreateDto } =
      bingoGame.toDto();

    return bingoGameCreateDto;
  }
}
