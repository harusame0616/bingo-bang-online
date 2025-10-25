import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { Heading } from "@/app/(noRobots)/_components/Heading";
import prisma from "@/lib/prisma";

export default async function BingoCardCompletePage({
	params,
}: PageProps<"/games/[bingoGameId]/settings">) {
	const bingoGameId = params.then(({ bingoGameId }) => bingoGameId);

	return (
		<div className="space-y-8">
			<Heading>閲覧専用ページリンク</Heading>
			<div className="flex justify-center">
				<Suspense fallback={<ViewLinksSkeleton />}>
					<ViewLinksContainer bingoGameId={bingoGameId} />
				</Suspense>
			</div>
			<p className="pt-1 text-center text-muted-foreground">
				※ 参加者にお伝えする際はこちらのリンクを使用してください。
			</p>
		</div>
	);
}

function ViewLinksSkeleton() {
	return (
		<ul aria-label="閲覧用リンク" className="flex flex-col">
			<li className="flex">
				<div className="h-5 w-40 bg-muted animate-pulse rounded" />
			</li>
			<li className="flex mt-2">
				<div className="h-5 w-32 bg-muted animate-pulse rounded" />
			</li>
		</ul>
	);
}

async function ViewLinksContainer({
	bingoGameId,
}: {
	bingoGameId: Promise<string>;
}) {
	const resolvedBingoGameId = await bingoGameId;

	const bingoGame = await prisma.bingoGameEntity.findUnique({
		where: { id: resolvedBingoGameId },
	});

	if (!bingoGame) {
		notFound();
	}

	return <ViewLinksPresenter viewId={bingoGame.viewId} />;
}

function ViewLinksPresenter({ viewId }: { viewId: string }) {
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
