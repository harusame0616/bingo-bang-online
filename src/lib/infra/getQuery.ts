import { InMemoryBingoGameQuery } from "@/domains/BingoGame/infrastructures/InMemoryBingoGame.query";
import { PrismaBingoGameQuery } from "@/domains/BingoGame/infrastructures/PrismaBingoGame.query";
import type { BingoGameQuery } from "@/domains/BingoGame/usecases/BingoGame.query";

import { getInfra, type Infra, InfraEnum } from "./common";

interface QueryMap {
	bingoGame: new () => BingoGameQuery;
}

interface QueryInstanceMap {
	bingoGame: BingoGameQuery;
}

const PrismaQueryMap: QueryMap = {
	bingoGame: PrismaBingoGameQuery,
};

const InMemoryQueryMap: QueryMap = {
	bingoGame: InMemoryBingoGameQuery,
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
