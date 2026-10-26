/** A resolved message code record, frozen and safe to share across requests. */
export interface MessageCodeInfo {
	/** Code name, injected from the registry key, e.g. `"ORIGIN_NOT_ALLOWED"`. */
	readonly code: string;
	/** Default HTTP status to pair with the code. */
	readonly status: number;
	/** Human-readable message suitable for an error body. */
	readonly message: string;
}

/** Definition supplied by a host; the `code` field is injected from the key. */
export type MessageCodeDefinition = {
	readonly status: number;
	readonly message: string;
};

/** Map of code name to definition, as accepted by {@link defineMessageCodes}. */
export type MessageCodeDefinitions = Record<string, MessageCodeDefinition>;

// Generic machine-readable codes a host can pair with any status.
const BUILTIN = {
	BAD_REQUEST: {
		status: 400,
		message: "The request could not be understood by the server.",
	},
	UNAUTHORIZED: {
		status: 401,
		message: "Authentication is required to access this resource.",
	},
	INVALID_TOKEN: {
		status: 401,
		message: "The provided authentication token is invalid.",
	},
	TOKEN_EXPIRED: {
		status: 401,
		message: "The provided authentication token has expired.",
	},
	FORBIDDEN: {
		status: 403,
		message: "The server understood the request but refuses to authorize it.",
	},
	INSUFFICIENT_SCOPE: {
		status: 403,
		message: "The authenticated principal lacks the required scope.",
	},
	ORIGIN_NOT_ALLOWED: {
		status: 403,
		message: "The request origin is not allowed.",
	},
	NOT_FOUND: {
		status: 404,
		message: "The requested resource could not be found.",
	},
	METHOD_NOT_ALLOWED: {
		status: 405,
		message: "The request method is not supported for this resource.",
	},
	CONFLICT: {
		status: 409,
		message: "The request conflicts with the current state of the resource.",
	},
	ALREADY_EXISTS: {
		status: 409,
		message: "The resource already exists.",
	},
	GONE: {
		status: 410,
		message: "The requested resource is no longer available.",
	},
	PRECONDITION_FAILED: {
		status: 412,
		message: "A precondition given in the request was not met.",
	},
	UNSUPPORTED_MEDIA_TYPE: {
		status: 415,
		message: "The request payload media type is not supported.",
	},
	UNPROCESSABLE_CONTENT: {
		status: 422,
		message: "The request was well-formed but contains semantic errors.",
	},
	VALIDATION_FAILED: {
		status: 422,
		message: "Request validation failed.",
	},
	TOO_MANY_REQUESTS: {
		status: 429,
		message: "Too many requests have been sent in a given amount of time.",
	},
	INTERNAL_ERROR: {
		status: 500,
		message: "An unexpected internal error occurred.",
	},
	NOT_IMPLEMENTED: {
		status: 501,
		message: "The requested functionality is not implemented.",
	},
	BAD_GATEWAY: {
		status: 502,
		message: "An invalid response was received from the upstream server.",
	},
	SERVICE_UNAVAILABLE: {
		status: 503,
		message: "The service is temporarily unavailable.",
	},
	GATEWAY_TIMEOUT: {
		status: 504,
		message: "The upstream server did not respond in time.",
	},
} as const satisfies MessageCodeDefinitions;

type BuiltinCode = keyof typeof BUILTIN;

function toInfo(
	code: string,
	definition: MessageCodeDefinition,
): MessageCodeInfo {
	return Object.freeze({
		code,
		status: definition.status,
		message: definition.message,
	});
}

const builtins = Object.fromEntries(
	Object.entries(BUILTIN).map(([code, definition]) => [
		code,
		toInfo(code, definition),
	]),
) as { [K in BuiltinCode]: MessageCodeInfo };

/**
 * A frozen message-code table. Builtin keys are always present; keys added
 * through {@link defineMessageCodes} are merged in as literals.
 */
export type MessageCodeTable<
	D extends MessageCodeDefinitions = Record<never, never>,
> = {
	readonly [K in BuiltinCode | (keyof D & string)]: MessageCodeInfo &
		Readonly<{ code: K }>;
};

/**
 * The 22 builtin message codes, keyed by literal name.
 *
 * Frozen. Host-specific codes are built with {@link defineMessageCodes} into
 * their own table; nothing mutates this object.
 *
 * @example
 * MessageCode.ORIGIN_NOT_ALLOWED.code; // "ORIGIN_NOT_ALLOWED"
 * MessageCode.ORIGIN_NOT_ALLOWED.status; // 403
 */
export const MessageCode: MessageCodeTable = Object.freeze(
	builtins,
) as MessageCodeTable;

/**
 * Builds a frozen message-code table from host definitions, merged over the
 * builtins.
 *
 * Pass an object literal (or `as const`) so the returned table keeps literal
 * keys; passing a pre-widened `MessageCodeDefinitions` variable degrades it to
 * a string index. Duplicate builtin names throw unless `override` is `true`.
 *
 * @param definitions - Code name to `{ status, message }` definitions.
 * @param options.override - Replace builtin definitions instead of throwing.
 * @returns A frozen table containing the builtins and the host codes.
 * @throws Error when a name is already builtin and `override` is not `true`.
 *
 * @example
 * const AppCode = defineMessageCodes({
 *   QUOTA_EXCEEDED: {
 *     status: 429,
 *     message: "The workspace quota has been exhausted.",
 *   },
 * });
 * AppCode.QUOTA_EXCEEDED.code; // "QUOTA_EXCEEDED"
 */
export function defineMessageCodes<const D extends MessageCodeDefinitions>(
	definitions: D,
	options: { override?: boolean } = {},
): MessageCodeTable<D> {
	for (const code of Object.keys(definitions)) {
		if (Object.hasOwn(builtins, code) && options.override !== true) {
			throw new Error(
				`@lst97-oss/last-httprism: message code "${code}" is already registered`,
			);
		}
	}
	const host = Object.fromEntries(
		Object.entries(definitions).map(([code, definition]) => [
			code,
			toInfo(code, definition),
		]),
	);
	return Object.freeze({ ...builtins, ...host }) as MessageCodeTable<D>;
}

/**
 * Looks up a message code in a table by name.
 *
 * @param table - A table from {@link MessageCode} or {@link defineMessageCodes}.
 * @param code - Runtime code name, e.g. `"ORIGIN_NOT_ALLOWED"`.
 * @returns The record, or `undefined` when the table has no own entry for it.
 *
 * @example
 * lookupMessageCode(AppCode, "QUOTA_EXCEEDED")?.status; // 429
 * lookupMessageCode(AppCode, "toString"); // undefined
 */
export function lookupMessageCode<
	T extends Readonly<Record<string, MessageCodeInfo>>,
>(table: T, code: string): T[keyof T] | undefined {
	return Object.hasOwn(table, code) ? table[code as keyof T] : undefined;
}
