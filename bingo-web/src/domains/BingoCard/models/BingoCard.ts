const FREE = 0;

type BingoCardDto = {
  id: string;
  squares: number[][];
};

export class BingoCard {
  constructor(private readonly dto: BingoCardDto) {}

  static generateCard() {
    const sourceNumbers = [...new Array(75)].map((_, i) => i + 1);

    const squares = [...new Array(5 * 5)].map(
      () =>
        sourceNumbers.splice(
          Math.floor(Math.random() * sourceNumbers.length),
          1
        )[0]
    );

    squares.splice(12, 1, FREE);

    const card: number[][] = [
      squares.slice(0, 5),
      squares.slice(5, 10),
      squares.slice(10, 15),
      squares.slice(15, 20),
      squares.slice(20, 25),
    ];

    return new BingoCard({
      id: crypto.randomUUID(),
      squares: card,
    });
  }

  toDto() {
    return {
      ...this.dto,
      squares: [
        this.dto.squares[0].slice(),
        this.dto.squares[1].slice(),
        this.dto.squares[2].slice(),
        this.dto.squares[3].slice(),
        this.dto.squares[4].slice(),
      ],
    };
  }
}
