/**
 * All 118 registered HTTP header names, keyed by upper-snake identifier.
 *
 * Values are the canonical wire casing; descriptions are intentionally not
 * shipped to keep the package small.
 *
 * @see https://www.iana.org/assignments/message-headers/message-headers.xhtml
 *
 * @example
 * HttpHeader.CONTENT_TYPE; // "Content-Type"
 */
export const HttpHeader = Object.freeze({
	CONTENT_ENCODING: "Content-Encoding",
	CONTENT_LANGUAGE: "Content-Language",
	CONTENT_LOCATION: "Content-Location",
	CONTENT_TYPE: "Content-Type",
	CONTENT_LENGTH: "Content-Length",
	CONTENT_RANGE: "Content-Range",
	TRANSFER_ENCODING: "Transfer-Encoding",
	CACHE_CONTROL: "Cache-Control",
	EXPECT: "Expect",
	HOST: "Host",
	HTTP2_SETTINGS: "HTTP2-Settings",
	MAX_FORWARDS: "Max-Forwards",
	PRAGMA: "Pragma",
	RANGE: "Range",
	TE: "TE",
	IF_MATCH: "If-Match",
	IF_MODIFIED_SINCE: "If-Modified-Since",
	IF_NONE_MATCH: "If-None-Match",
	IF_RANGE: "If-Range",
	IF_UNMODIFIED_SINCE: "If-Unmodified-Since",
	ACCEPT: "Accept",
	ACCEPT_CHARSET: "Accept-Charset",
	ACCEPT_ENCODING: "Accept-Encoding",
	ACCEPT_LANGUAGE: "Accept-Language",
	AUTHORIZATION: "Authorization",
	PROXY_AUTHORIZATION: "Proxy-Authorization",
	DNT: "DNT",
	FROM: "From",
	REFERER: "Referer",
	USER_AGENT: "User-Agent",
	AGE: "Age",
	EXPIRES: "Expires",
	DATE: "Date",
	LOCATION: "Location",
	RETRY_AFTER: "Retry-After",
	TK: "Tk",
	VARY: "Vary",
	WARNING: "Warning",
	ETAG: "ETag",
	LAST_MODIFIED: "Last-Modified",
	WWW_AUTHENTICATE: "WWW-Authenticate",
	PROXY_AUTHENTICATE: "Proxy-Authenticate",
	ACCEPT_RANGES: "Accept-Ranges",
	ALLOW: "Allow",
	SERVER: "Server",
	ACCEPT_PATCH: "Accept-Patch",
	ACCEPT_POST: "Accept-Post",
	ACCESS_CONTROL_ALLOW_CREDENTIALS: "Access-Control-Allow-Credentials",
	ACCESS_CONTROL_ALLOW_HEADERS: "Access-Control-Allow-Headers",
	ACCESS_CONTROL_ALLOW_METHODS: "Access-Control-Allow-Methods",
	ACCESS_CONTROL_ALLOW_ORIGIN: "Access-Control-Allow-Origin",
	ACCESS_CONTROL_EXPOSE_HEADERS: "Access-Control-Expose-Headers",
	ACCESS_CONTROL_MAX_AGE: "Access-Control-Max-Age",
	ACCESS_CONTROL_REQUEST_HEADERS: "Access-Control-Request-Headers",
	ACCESS_CONTROL_REQUEST_METHOD: "Access-Control-Request-Method",
	CONTENT_DISPOSITION: "Content-Disposition",
	CONTENT_SECURITY_POLICY: "Content-Security-Policy",
	CONTENT_SECURITY_POLICY_REPORT_ONLY: "Content-Security-Policy-Report-Only",
	COOKIE: "Cookie",
	FORWARDED: "Forwarded",
	LINK: "Link",
	ORIGIN: "Origin",
	PREFER: "Prefer",
	PREFERENCE_APPLIED: "Preference-Applied",
	SET_COOKIE: "Set-Cookie",
	STRICT_TRANSPORT_SECURITY: "Strict-Transport-Security",
	VIA: "Via",
	A_IM: "A-IM",
	ACCEPT_CH: "Accept-CH",
	ACCEPT_FEATURES: "Accept-Features",
	ALPN: "ALPN",
	ALT_SVC: "Alt-Svc",
	ALTERNATES: "Alternates",
	APPLY_TO_REDIRECT_REF: "Apply-To-Redirect-Ref",
	CH: "CH",
	CONTENT_BASE: "Content-Base",
	CONTENT_DPR: "Content-DPR",
	COOKIE2: "Cookie2",
	DASL: "DASL",
	DAV: "DAV",
	DELTA_BASE: "Delta-Base",
	DEPTH: "Depth",
	DESTINATION: "Destination",
	DPR: "DPR",
	ENCRYPTION: "Encryption",
	ENCRYPTION_KEY: "Encryption-Key",
	IM: "IM",
	IF: "If",
	IF_SCHEDULE_TAG_MATCH: "If-Schedule-Tag-Match",
	KEY: "Key",
	LAST_EVENT_ID: "Last-Event-ID",
	LINK_TEMPLATE: "Link-Template",
	LOCK_TOKEN: "Lock-Token",
	MD: "MD",
	NEGOTIATE: "Negotiate",
	NICE: "Nice",
	OVERWRITE: "Overwrite",
	POE: "POE",
	POE_LINKS: "POE-Links",
	REDIRECT_REF: "Redirect-Ref",
	RW: "RW",
	SCHEDULE_REPLY: "Schedule-Reply",
	SCHEDULE_TAG: "Schedule-Tag",
	SEC_WEBSOCKET_ACCEPT: "Sec-WebSocket-Accept",
	SEC_WEBSOCKET_EXTENSIONS: "Sec-WebSocket-Extensions",
	SEC_WEBSOCKET_KEY: "Sec-WebSocket-Key",
	SEC_WEBSOCKET_PROTOCOL: "Sec-WebSocket-Protocol",
	SEC_WEBSOCKET_VERSION: "Sec-WebSocket-Version",
	SET_COOKIE2: "Set-Cookie2",
	SLUG: "SLUG",
	STATUS_URI: "Status-URI",
	SUNSET: "Sunset",
	SURROGATE_CAPABILITY: "Surrogate-Capability",
	SURROGATE_CONTROL: "Surrogate-Control",
	TCN: "TCN",
	TIMEOUT: "Timeout",
	VARIANT_VARY: "Variant-Vary",
	X_FRAME_OPTIONS: "X-Frame-Options",
} as const);

const canonicalHeaderNames = new Map<string, string>(
	Object.values(HttpHeader).map((name) => [name.toLowerCase(), name] as const),
);

/**
 * Resolves a header name to its canonical casing, case-insensitively.
 *
 * @param name - Header name in any casing, e.g. `"content-type"`.
 * @returns The canonical name, or `undefined` when the header is not registered.
 *
 * @example
 * canonicalHeaderName("content-type"); // "Content-Type"
 * canonicalHeaderName("x-custom"); // undefined
 */
export function canonicalHeaderName(name: string): string | undefined {
	return canonicalHeaderNames.get(name.toLowerCase());
}
