import type { PropsWithChildren } from "react";

export function BingoCardList({ children }: PropsWithChildren) {
	return (
		<ul
			aria-label="ビンゴカード"
			className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5"
		>
			{children}
		</ul>
	);
}
