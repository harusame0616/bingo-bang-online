type BingoGameCreateDto = Omit<BingoGameDto, "hashedManagementPassword">;

class BingoGameCreate {
  constructor(private readonly bingoGameRepository: BingoGameRepository) {}

  async execute(): Promise<BingoGameCreateDto> {
    const bingoGame = BingoGame.createGame();

    await this.bingoGameRepository.save(bingoGame);

    const { hashedManagementPassword, ...bingoGameCreateDto } =
      bingoGame.toDto();

    return bingoGameCreateDto;
  }
}
