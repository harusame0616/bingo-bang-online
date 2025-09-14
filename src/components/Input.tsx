"use client";

import type { ComponentProps } from "react";

import { Input as ShadcnInput } from "./ui/input";

export function Input(props: ComponentProps<typeof ShadcnInput>) {
	return <ShadcnInput {...props} />;
}
