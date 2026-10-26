import {
	defineProviderStatuses,
	type ProviderStatusInfo,
	type StatusEntry,
} from "../core/define.js";

/** Provider id stored on {@link CloudflareStatus} records. */
export const CLOUDFLARE = "cloudflare" as const;

// Cloudflare's reverse proxy expands the 5xx range to signal origin problems.
const entries = [
	[
		520,
		"UNKNOWN_ERROR",
		"Unknown Error",
		'The 520 error is used as a "catch-all response for when the origin server returns something unexpected", listing connection resets, large headers, and empty or invalid responses as common triggers.',
	],
	[
		521,
		"WEB_SERVER_IS_DOWN",
		"Web Server Is Down",
		"The origin server has refused the connection from Cloudflare.",
	],
	[
		522,
		"CONNECTION_TIMED_OUT",
		"Connection Timed Out",
		"Cloudflare could not negotiate a TCP handshake with the origin server.",
	],
	[
		523,
		"ORIGIN_IS_UNREACHABLE",
		"Origin Is Unreachable",
		"Cloudflare could not reach the origin server.",
	],
	[
		524,
		"A_TIMEOUT_OCCURRED",
		"A Timeout Occurred",
		"Cloudflare was able to complete a TCP connection to the origin server, but did not receive a timely HTTP response.",
	],
	[
		525,
		"SSL_HANDSHAKE_FAILED",
		"SSL Handshake Failed",
		"Cloudflare could not negotiate a SSL/TLS handshake with the origin server.",
	],
	[
		526,
		"INVALID_SSL_CERTIFICATE",
		"Invalid SSL Certificate",
		"Cloudflare could not validate the SSL/TLS certificate that the origin server presented.",
	],
	[
		527,
		"RAILGUN_ERROR",
		"Railgun Error",
		"Historical code from Cloudflare's discontinued Railgun feature; the request timed out or failed after the WAN connection was established.",
	],
	[
		530,
		"ORIGIN_DNS_ERROR",
		"Origin DNS Error",
		"Cloudflare could not resolve the origin hostname, so it could not connect to the origin server. The response body carries the specific 1XXX error code.",
	],
] as const satisfies readonly StatusEntry[];

const statuses = defineProviderStatuses(CLOUDFLARE, entries);

/**
 * Cloudflare reverse-proxy status codes: 520–526, 530, and historical 527.
 *
 * Exported only from `last-httprism/cloudflare`; these codes never resolve from
 * the standard lookup.
 *
 * @see https://developers.cloudflare.com/support/troubleshooting/http-status-codes/cloudflare-5xx-errors/
 *
 * @example
 * CloudflareStatus.ORIGIN_DNS_ERROR.code; // 530
 */
export const CloudflareStatus = statuses.byName;

/**
 * Looks up a Cloudflare status by code.
 *
 * @param code - Cloudflare code, e.g. `522`.
 * @returns The record, or `undefined` for codes Cloudflare does not define.
 */
export function statusByCode(code: number): ProviderStatusInfo | undefined {
	return statuses.byCode.get(code);
}
