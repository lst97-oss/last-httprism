/** Semantics registered for an HTTP method. */
export interface MethodInfo {
	/** Registered method name, e.g. `"PATCH"`. */
	readonly method: string;
	/** Safe methods are read-only by contract. */
	readonly safe: boolean;
	/** Idempotent methods can be replayed without changing the outcome. */
	readonly idempotent: boolean;
	/** Cacheable methods may be stored by caches. */
	readonly cacheable: boolean;
}

type MethodEntry = readonly [
	key: string,
	method: string,
	safe: boolean,
	idempotent: boolean,
	cacheable: boolean,
];

// `cacheable` is false where the registry does not specify it.
const entries = [
	["CONNECT", "CONNECT", false, false, false],
	["DELETE", "DELETE", false, true, false],
	["GET", "GET", true, true, true],
	["HEAD", "HEAD", true, true, true],
	["OPTIONS", "OPTIONS", true, true, false],
	["POST", "POST", false, false, false],
	["PUT", "PUT", false, true, false],
	["TRACE", "TRACE", true, true, false],
	["ACL", "ACL", false, true, false],
	["BASELINE_CONTROL", "BASELINE-CONTROL", false, true, false],
	["BIND", "BIND", false, true, false],
	["CHECKIN", "CHECKIN", false, true, false],
	["CHECKOUT", "CHECKOUT", false, true, false],
	["COPY", "COPY", false, true, false],
	["LABEL", "LABEL", false, true, false],
	["LINK", "LINK", false, true, false],
	["LOCK", "LOCK", false, false, false],
	["MERGE", "MERGE", false, true, false],
	["MKACTIVITY", "MKACTIVITY", false, true, false],
	["MKCALENDAR", "MKCALENDAR", false, true, false],
	["MKCOL", "MKCOL", false, true, false],
	["MKREDIRECTREF", "MKREDIRECTREF", false, true, false],
	["MKWORKSPACE", "MKWORKSPACE", false, true, false],
	["MOVE", "MOVE", false, true, false],
	["ORDERPATCH", "ORDERPATCH", false, true, false],
	["PATCH", "PATCH", false, false, false],
	["PROPFIND", "PROPFIND", true, true, false],
	["PROPPATCH", "PROPPATCH", false, true, false],
	["REBIND", "REBIND", false, true, false],
	["REPORT", "REPORT", true, true, false],
	["SEARCH", "SEARCH", true, true, false],
	["UNBIND", "UNBIND", false, true, false],
	["UNCHECKOUT", "UNCHECKOUT", false, true, false],
	["UNLINK", "UNLINK", false, true, false],
	["UNLOCK", "UNLOCK", false, true, false],
	["UPDATE", "UPDATE", false, true, false],
	["UPDATEREDIRECTREF", "UPDATEREDIRECTREF", false, true, false],
	["VERSION_CONTROL", "VERSION-CONTROL", false, true, false],
] as const satisfies readonly MethodEntry[];

/** Identifier keys of {@link HttpMethod}, e.g. `"BASELINE_CONTROL"`. */
export type HttpMethodKey = (typeof entries)[number][0];
/** Registered method names, e.g. `"BASELINE-CONTROL"`. */
export type HttpMethodName = (typeof entries)[number][1];

const methodNames = Object.fromEntries(
	entries.map(([key, method]) => [key, method] as const),
) as Record<HttpMethodKey, HttpMethodName>;

/**
 * All 38 registered HTTP methods, keyed by identifier.
 *
 * @example
 * HttpMethod.BASELINE_CONTROL; // "BASELINE-CONTROL"
 * HttpMethod.GET; // "GET"
 */
export const HttpMethod: Readonly<Record<HttpMethodKey, HttpMethodName>> =
	Object.freeze(methodNames);

const infoByMethod = new Map<string, MethodInfo>();
for (const [, method, safe, idempotent, cacheable] of entries) {
	infoByMethod.set(
		method,
		Object.freeze({ method, safe, idempotent, cacheable }),
	);
}

/**
 * Looks up method semantics, case-insensitively.
 *
 * @param name - Method name in any casing, e.g. `"get"`.
 * @returns The semantics record, or `undefined` for unregistered methods.
 *
 * @example
 * methodInfo("get")?.safe; // true
 * methodInfo("POST")?.idempotent; // false
 */
export function methodInfo(name: string): MethodInfo | undefined {
	return infoByMethod.get(name.toUpperCase());
}
