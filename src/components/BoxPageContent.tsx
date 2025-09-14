import type { DetailedHTMLProps, HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export function PageBox({
	className,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
	return (
		<div className={cn("mx-auto max-w-screen-lg px-4", className)} {...props} />
	);
}
