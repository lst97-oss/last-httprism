import {
	defineProviderStatuses,
	type ProviderStatusInfo,
	type StatusEntry,
} from "../core/define.js";

/** Provider id stored on {@link NginxStatus} records. */
export const NGINX = "nginx" as const;

// NGINX expands the 4xx range to signal client-side issues it handles itself.
const entries = [
	[
		444,
		"NO_RESPONSE",
		"No Response",
		"Used internally to instruct the server to return no information to the client and close the connection immediately.",
	],
	[
		494,
		"REQUEST_HEADER_TOO_LARGE",
		"Request Header Too Large",
		"Client sent too large request or too long header line.",
	],
	[
		495,
		"SSL_CERTIFICATE_ERROR",
		"SSL Certificate Error",
		"An expansion of the 400 Bad Request response code, used when the client has provided an invalid client certificate.",
	],
	[
		496,
		"SSL_CERTIFICATE_REQUIRED",
		"SSL Certificate Required",
		"An expansion of the 400 Bad Request response code, used when a client certificate is required but not provided.",
	],
	[
		497,
		"HTTP_REQUEST_SENT_TO_HTTPS_PORT",
		"HTTP Request Sent to HTTPS Port",
		"An expansion of the 400 Bad Request response code, used when the client has made a HTTP request to a port listening for HTTPS requests.",
	],
	[
		499,
		"CLIENT_CLOSED_REQUEST",
		"Client Closed Request",
		"Used when the client has closed the request before the server could send a response.",
	],
] as const satisfies readonly StatusEntry[];

const statuses = defineProviderStatuses(NGINX, entries);

/**
 * nginx-internal status codes: 444, 494–497, and 499.
 *
 * Exported only from `last-httprism/nginx`; these codes never resolve from the
 * standard lookup.
 *
 * @see https://github.com/nginx/nginx/blob/master/src/http/ngx_http_request.h
 *
 * @example
 * NginxStatus.NO_RESPONSE.code; // 444
 * NginxStatus.CLIENT_CLOSED_REQUEST.code; // 499
 */
export const NginxStatus = statuses.byName;

/**
 * Looks up an nginx status by code.
 *
 * @param code - nginx code, e.g. `444`.
 * @returns The record, or `undefined` for codes nginx does not define.
 */
export function statusByCode(code: number): ProviderStatusInfo | undefined {
	return statuses.byCode.get(code);
}
