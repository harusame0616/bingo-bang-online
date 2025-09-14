import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function Chip({
	className,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement>) {
	return (
		<div
			className={`flex w-16 justify-center rounded-lg bg-primary-lighten text-primary-darken ${
				className ?? ""
			}`}
			{...props}
		/>
	);
}
