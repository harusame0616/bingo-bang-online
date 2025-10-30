import type { Metadata } from "next";
import type { PropsWithChildren } from "react";

export const metadata: Metadata = {
	robots: "noindex, nofollow",
};

export default function NoRobotsLayout({ children }: PropsWithChildren) {
	return children;
}
