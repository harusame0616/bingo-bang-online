import { InMemoryBingoCardRepository } from "@/domains/BingoCard/infrastructures/infrastructures/InMemoryBingoCard.repository";
import { PrismaBingoCardRepository } from "@/domains/BingoCard/infrastructures/infrastructures/PrismaBingoCard.repository";
import type { BingoCardRepository } from "@/domains/BingoCard/usecases/BingoCard.repository";
import { InMemoryBingoGameRepository } from "@/domains/BingoGame/infrastructures/InMemoryBingoGame.repository";
import { PrismaBingoGameRepository } from "@/domains/BingoGame/infrastructures/PrismaBingoGame.repository";
import type { BingoGameRepository } from "@/domains/BingoGame/usecases/BingoGame.repository";

import { getInfra, type Infra, InfraEnum } from "./common";

interface RepositoryMap {
	bingoGame: new () => BingoGameRepository;
	bingoCard: new () => BingoCardRepository;
}

interface RepositoryInstanceMap {
	bingoGame: BingoGameRepository;
	bingoCard: BingoCardRepository;
}

const PrismaRepositoryMap: RepositoryMap = {
	bingoGame: PrismaBingoGameRepository,
	bingoCard: PrismaBingoCardRepository,
} as const;

const InMemoryRepositoryMap: RepositoryMap = {
	bingoGame: InMemoryBingoGameRepository,
	bingoCard: InMemoryBingoCardRepository,
} as const;

const InfraRepositoryMap: Record<Infra, RepositoryMap> = {
	[InfraEnum.INMEMORY]: InMemoryRepositoryMap,
	[InfraEnum.PRISMA]: PrismaRepositoryMap,
} as const;

export function getRepository<T extends keyof RepositoryInstanceMap>(
	repositoryName: T,
): RepositoryInstanceMap[T] {
	return new InfraRepositoryMap[getInfra()][
		repositoryName
	]() as RepositoryInstanceMap[T];
}
