import {
	defineProviderStatuses,
	type ProviderStatusInfo,
	type StatusEntry,
} from "../core/define.js";

/** Provider id stored on {@link IisStatus} records. */
export const IIS = "iis" as const;

// Microsoft IIS and Exchange ActiveSync responses that are not standard codes.
const entries = [
	[
		440,
		"LOGIN_TIME_OUT",
		"Login Time-out",
		"The client's session has expired and must log in again.",
	],
	[
		449,
		"RETRY_WITH",
		"Retry With",
		"The server cannot honour the request because the client has not provided the required information or provisioning.",
	],
	[
		451,
		"REDIRECT",
		"Redirect",
		"Exchange ActiveSync: the client connected to a server that cannot access the user's mailbox, or a more efficient server is available.",
	],
] as const satisfies readonly StatusEntry[];

const statuses = defineProviderStatuses(IIS, entries);

/**
 * Microsoft IIS and Exchange ActiveSync status codes: 440, 449, and 451.
 *
 * `IisStatus.REDIRECT` shares the number 451 with the standard legal-reasons
 * code; because vendor namespaces never merge, both meanings coexist.
 *
 * @see https://learn.microsoft.com/en-us/openspecs/exchange_server_protocols/ms-ashttp/4cbf28dc-2876-41c6-9d87-ba9db86cd40d
 *
 * @example
 * IisStatus.LOGIN_TIME_OUT.code; // 440
 * IisStatus.REDIRECT.code; // 451
 */
export const IisStatus = statuses.byName;

/**
 * Looks up an IIS status by code.
 *
 * @param code - IIS code, e.g. `449`.
 * @returns The record, or `undefined` for codes IIS does not define.
 */
export function statusByCode(code: number): ProviderStatusInfo | undefined {
	return statuses.byCode.get(code);
}
