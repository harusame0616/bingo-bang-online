export const InfraEnum = {
	INMEMORY: "INMEMORY",
	PRISMA: "PRISMA",
} as const;

export type Infra = (typeof InfraEnum)[keyof typeof InfraEnum];

export function getInfra() {
	return process.env.INFRA === "INMEMORY"
		? InfraEnum.INMEMORY
		: InfraEnum.PRISMA;
}
