import type { Result } from "./result";

// version skew などで undefined を返す可能性がある
export type ServerActionResult<Data = Record<string, unknown>> = Promise<
	Result<Data> | undefined
>;
