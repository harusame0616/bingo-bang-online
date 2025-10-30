import type { DetailedHTMLProps, HTMLAttributes } from "react";

export function Section({
	className,
	...props
}: DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement>) {
	return (
		<section
			className={`mb-12 w-full last:mb-0 ${className || ""}`}
			{...props}
		/>
	);
}
