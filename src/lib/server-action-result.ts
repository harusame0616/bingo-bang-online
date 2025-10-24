import type { Result } from "@harusame0616/result";

// version skew などで undefined を返す可能性がある
export type ServerActionResult<Data = Record<string, unknown>> = Promise<
	Result<Data, string> | undefined
>;
