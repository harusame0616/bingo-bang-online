export type Success<Data = Record<string, unknown>> = {
	success: true;
	data: Data;
};
export type Failure = { success: false; message: string };
export type Result<Data = Record<string, unknown>> = Success<Data> | Failure;

export function succeed(): Success<Record<string, unknown>>;
export function succeed<Data extends Record<string, unknown>>(
	data: Data,
): Success<Data>;
export function succeed(data?: Record<string, unknown>) {
	if (!data) {
		return { success: true, data: {} };
	}

	return { success: true, data };
}

export function fail(message?: string): Failure {
	return { success: false, message: message || "" };
}
