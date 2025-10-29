import type { PropsWithChildren } from "react";

export function Heading({
	children,
	srOnly = false,
}: PropsWithChildren<{ srOnly?: boolean }>) {
	const style = srOnly
		? "sr-only"
		: "mb-2 text-center text-base text-primary-darken";
	return <h2 className={style}>{children}</h2>;
}
