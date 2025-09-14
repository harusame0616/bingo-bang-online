export const FREE = 0;
export const LOTTERY_NUMBER_MAX = 75;
export interface BingoCardDto {
	id: string;
	squares: number[][];
	name: string;
	bingoGameId: string;
}

export interface GeneratCardProps {
	name?: string;
}

export class BingoCard {
	constructor(private readonly dto: BingoCardDto) {}

	get id() {
		return this.dto.id;
	}

	get name() {
		return this.dto.name;
	}

	get bingoGameId() {
		return this.dto.bingoGameId;
	}

	static generateCard(bingoGameId: string, { name }: { name?: string } = {}) {
		const sourceNumbers = [...new Array(LOTTERY_NUMBER_MAX)].map(
			(_, i) => i + 1,
		);

		const squares = [...new Array(5 * 5)].map(
			() =>
				sourceNumbers.splice(
					Math.floor(Math.random() * sourceNumbers.length),
					1,
				)[0],
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
			name: name ?? "",
			bingoGameId,
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
