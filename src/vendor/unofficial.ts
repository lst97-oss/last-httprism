import {
	defineProviderStatuses,
	type ProviderStatusInfo,
	type StatusEntry,
} from "../core/define.js";

/** Provider id stored on {@link UnofficialStatus} records. */
export const UNOFFICIAL = "unofficial" as const;

// Codes used in the wild that IANA does not assign. Each message names its source.
const entries = [
	[
		218,
		"THIS_IS_FINE",
		"This Is Fine",
		"Unofficial code used by some servers to signal a successful request despite an alarming state. Unassigned by IANA.",
	],
	[
		419,
		"PAGE_EXPIRED",
		"Page Expired",
		"Laravel returns this when a CSRF token is missing or has expired. Unassigned by IANA.",
	],
	[
		420,
		"ENHANCE_YOUR_CALM",
		"Enhance Your Calm",
		"Historic Twitter rate-limiting code; Spring Framework uses 420 for method failure. Unassigned by IANA.",
	],
	[
		509,
		"BANDWIDTH_LIMIT_EXCEEDED",
		"Bandwidth Limit Exceeded",
		"Used by cPanel and Apache bandwidth-limiting modules when an account exceeds its transfer quota. Unassigned by IANA.",
	],
	[
		599,
		"NETWORK_CONNECT_TIMEOUT",
		"Network Connect Timeout Error",
		"Emitted by some proxies and HTTP clients when connecting to the upstream times out. Unassigned by IANA.",
	],
] as const satisfies readonly StatusEntry[];

const statuses = defineProviderStatuses(UNOFFICIAL, entries);

/**
 * Codes used in the wild that IANA does not assign: 218, 419, 420, 509, 599.
 *
 * Every message names the framework, proxy, or service that emits the code;
 * treat these as descriptive, not normative.
 *
 * @example
 * UnofficialStatus.PAGE_EXPIRED.code; // 419 (Laravel)
 * UnofficialStatus.NETWORK_CONNECT_TIMEOUT.code; // 599
 */
export const UnofficialStatus = statuses.byName;

/**
 * Looks up an unofficial status by code.
 *
 * @param code - Unofficial code, e.g. `419`.
 * @returns The record, or `undefined` for codes this extension does not define.
 */
export function statusByCode(code: number): ProviderStatusInfo | undefined {
	return statuses.byCode.get(code);
}
