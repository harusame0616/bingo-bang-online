import { InMemoryBingoCardQuery } from "@/domains/BingoCard/infrastructures/infrastructures/InMemoryBingoCard.query";
import { PrismaBingoCardQuery } from "@/domains/BingoCard/infrastructures/infrastructures/PrismaBingoCard.query";
import type { BingoCardQuery } from "@/domains/BingoCard/usecases/BingoCard.query";
import { InMemoryBingoGameQuery } from "@/domains/BingoGame/infrastructures/InMemoryBingoGame.query";
import { PrismaBingoGameQuery } from "@/domains/BingoGame/infrastructures/PrismaBingoGame.query";
import type { BingoGameQuery } from "@/domains/BingoGame/usecases/BingoGame.query";

import { getInfra, type Infra, InfraEnum } from "./common";

interface QueryMap {
	bingoGame: new () => BingoGameQuery;
	bingoCard: new () => BingoCardQuery;
}

interface QueryInstanceMap {
	bingoGame: BingoGameQuery;
	bingoCard: BingoCardQuery;
}

const PrismaQueryMap: QueryMap = {
	bingoGame: PrismaBingoGameQuery,
	bingoCard: PrismaBingoCardQuery,
};

const InMemoryQueryMap: QueryMap = {
	bingoGame: InMemoryBingoGameQuery,
	bingoCard: InMemoryBingoCardQuery,
};

const InfraQueryMap: Record<Infra, QueryMap> = {
	[InfraEnum.INMEMORY]: InMemoryQueryMap,
	[InfraEnum.PRISMA]: PrismaQueryMap,
};

export function getQuery<T extends keyof QueryInstanceMap>(
	queryName: T,
): QueryInstanceMap[T] {
	return new InfraQueryMap[getInfra()][queryName]() as QueryInstanceMap[T];
}
