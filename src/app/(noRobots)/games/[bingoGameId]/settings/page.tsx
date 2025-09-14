import { ReloadIcon } from "@radix-ui/react-icons";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Heading } from "@/app/(noRobots)/_components/Heading";
import prisma from "@/lib/prisma";

export default async function BingoCardCompletePage({
	params,
}: PageProps<"/games/[bingoGameId]/settings">) {
	const { bingoGameId } = await params;

	return (
		<div className="space-y-8">
			<Heading>閲覧専用ページリンク</Heading>
			<div className="flex justify-center">
				<Suspense
					fallback={
						<div>
							<ReloadIcon className="mr-2 h-8 w-8 animate-spin" />
						</div>
					}
				>
					<ViewLinksContainer bingoGameId={bingoGameId} />
				</Suspense>
			</div>
			<p className="pt-1 text-center text-muted-foreground">
				※ 参加者にお伝えする際はこちらのリンクを使用してください。
			</p>
		</div>
	);
}

async function getBingoGame(bingoGameId: string) {
	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { id: bingoGameId },
	});
	if (!bingoGame) {
		notFound();
	}

	return bingoGame.viewId;
}

async function ViewLinksContainer({ bingoGameId }: { bingoGameId: string }) {
	const viewId = await getBingoGame(bingoGameId);

	return <ViewLinksPresenter viewId={viewId} />;
}

async function ViewLinksPresenter({ viewId }: { viewId: string }) {
	return (
		<ul aria-label="閲覧用リンク" className="flex flex-col">
			<li className="flex">
				・
				<Link
					href={`/views/${viewId}/lottery_numbers`}
					className="italic underline hover:text-primary-darken"
				>
					抽選番号発表ページ
				</Link>
			</li>
			<li className="flex">
				・
				<Link
					href={`/views/${viewId}/cards`}
					className="italic underline hover:text-primary-darken"
				>
					カード一覧ページ
				</Link>
			</li>
		</ul>
	);
}
