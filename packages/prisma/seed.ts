import { PrismaClient } from "./generated";

const prisma = new PrismaClient();

export async function main() {
	console.log("Starting seed...");

	// 既存データのクリーンアップ
	await prisma.bingoCardEntity.deleteMany();
	await prisma.bingoGameEntity.deleteMany();

	// 74回抽選済みのテストゲームを作成
	const lotteryNumbers74 = Array.from({ length: 74 }, (_, i) => i + 1);

	const game74Draws = await prisma.bingoGameEntity.create({
		data: {
			id: "12345678-1234-5678-1234-567812345678",
			viewId: "87654321-4321-8765-4321-876543218765",
			lotteryNumbers: lotteryNumbers74,
			sound: true,
		},
	});

	console.log("Seed completed successfully");
	console.log("Created game:", {
		id: game74Draws.id,
		drawCount: game74Draws.lotteryNumbers.length,
	});
}

main()
	.catch((e) => {
		console.error("Seed failed:", e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
