/** Response class of an HTTP status code, e.g. `"4xx"`. */
export type StatusClass = "1xx" | "2xx" | "3xx" | "4xx" | "5xx";

/** A single resolved HTTP status record. */
export interface StatusInfo {
	/** Numeric status code, e.g. `404`. */
	readonly code: number;
	/** Upper-snake identifier, e.g. `"NOT_FOUND"`. */
	readonly name: string;
	/** IANA reason phrase, e.g. `"Not Found"`. */
	readonly phrase: string;
	/** One-sentence description of the status. */
	readonly message: string;
	/** Response class derived from the code. */
	readonly class: StatusClass;
}

/** A vendor status record; `provider` names the extension that defined it. */
export interface ProviderStatusInfo extends StatusInfo {
	/** Provider id, e.g. `"cloudflare"`. */
	readonly provider: string;
}

/**
 * Tuple form every status dataset is authored in:
 * `[code, NAME, phrase, message]`.
 */
export type StatusEntry = readonly [
	code: number,
	name: string,
	phrase: string,
	message: string,
];

/**
 * Result of {@link defineStatuses}: a literal-keyed name lookup plus a code map.
 *
 * The `byName` keys are inferred from the entries, so `table.OK` type-checks
 * without a cast while unknown names fail at compile time.
 */
export interface StatusTable<E extends readonly StatusEntry[]> {
	readonly byName: { readonly [N in E[number][1]]: StatusInfo };
	readonly byCode: ReadonlyMap<number, StatusInfo>;
}

/**
 * Result of {@link defineProviderStatuses}, with provider-tagged records.
 */
export interface ProviderStatusTable<E extends readonly StatusEntry[]> {
	readonly byName: { readonly [N in E[number][1]]: ProviderStatusInfo };
	readonly byCode: ReadonlyMap<number, ProviderStatusInfo>;
}

/**
 * Derives the response class from a 3-digit status code.
 *
 * @param code - Numeric status code, e.g. `404`.
 * @returns The matching class, e.g. `"4xx"`.
 *
 * @example
 * statusClassOfCode(404); // "4xx"
 */
export function statusClassOfCode(code: number): StatusClass {
	return `${Math.floor(code / 100)}xx` as StatusClass;
}

function build(entries: readonly StatusEntry[], provider?: string) {
	const byName: Record<string, StatusInfo> = {};
	const byCode = new Map<number, StatusInfo>();
	for (const [code, name, phrase, message] of entries) {
		const base = {
			code,
			name,
			phrase,
			message,
			class: statusClassOfCode(code),
		};
		const info: StatusInfo = Object.freeze(
			provider === undefined ? base : { ...base, provider },
		);
		byName[name] = info;
		byCode.set(code, info);
	}
	return { byName: Object.freeze(byName), byCode };
}

/**
 * Builds a frozen, literal-typed status table from tuple entries.
 *
 * @param entries - `[code, NAME, phrase, message]` tuples authored with `as const`.
 *
 * @example
 * const table = defineStatuses([
 *   [200, "OK", "OK", "The request has succeeded."],
 * ] as const);
 * table.byName.OK.code; // 200
 */
export function defineStatuses<const E extends readonly StatusEntry[]>(
	entries: E,
): StatusTable<E> {
	return build(entries) as unknown as StatusTable<E>;
}

/**
 * Builds a frozen, provider-tagged status table from tuple entries.
 *
 * This is the extension template: every vendor module calls it with its own
 * provider id, keeping vendor codes in a namespace that can never collide with
 * the standard registry.
 *
 * @param provider - Provider id stored on every record, e.g. `"nginx"`.
 * @param entries - `[code, NAME, phrase, message]` tuples authored with `as const`.
 *
 * @example
 * const table = defineProviderStatuses("nginx", [
 *   [444, "NO_RESPONSE", "No Response", "The server closes the connection."],
 * ] as const);
 * table.byName.NO_RESPONSE.provider; // "nginx"
 */
export function defineProviderStatuses<const E extends readonly StatusEntry[]>(
	provider: string,
	entries: E,
): ProviderStatusTable<E> {
	return build(entries, provider) as unknown as ProviderStatusTable<E>;
}
