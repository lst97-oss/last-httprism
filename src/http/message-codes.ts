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

/** Map of code name to definition, as accepted by {@link registerMessageCodes}. */
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

type BuiltinMessageCode = keyof typeof BUILTIN;

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
) as { [K in BuiltinMessageCode]: MessageCodeInfo };

/**
 * The 22 builtin message codes plus everything added through
 * {@link registerMessageCodes}.
 *
 * Builtin keys are literal-typed, so `MessageCode.ORIGIN_NOT_ALLOWED` is
 * checked at compile time; host codes are reachable through the string index.
 *
 * @example
 * MessageCode.ORIGIN_NOT_ALLOWED;
 * // { code: "ORIGIN_NOT_ALLOWED", status: 403, message: "The request origin is not allowed." }
 */
export const MessageCode = builtins as typeof builtins &
	Record<string, MessageCodeInfo>;

const registry = new Map<string, MessageCodeInfo>(Object.entries(builtins));

/**
 * Registers host-specific message codes in the shared global registry.
 *
 * Definitions are frozen and immediately visible through {@link MessageCode}
 * and {@link messageCodeInfo}. Register once at application startup.
 *
 * @param codes - Code name to `{ status, message }` definitions.
 * @param options.override - Replace existing definitions instead of throwing.
 * @throws Error when a code is already registered and `override` is not `true`.
 *
 * @example
 * registerMessageCodes({
 *   QUOTA_EXCEEDED: {
 *     status: 429,
 *     message: "The workspace quota has been exhausted.",
 *   },
 * });
 *
 * MessageCode.QUOTA_EXCEEDED.status; // 429
 */
export function registerMessageCodes(
	codes: MessageCodeDefinitions,
	options: { override?: boolean } = {},
): void {
	for (const code of Object.keys(codes)) {
		if (registry.has(code) && options.override !== true) {
			throw new Error(
				`@lst97-oss/last-httprism: message code "${code}" is already registered`,
			);
		}
	}
	for (const [code, definition] of Object.entries(codes)) {
		const info = toInfo(code, definition);
		registry.set(code, info);
		MessageCode[code] = info;
	}
}

/**
 * Looks up a message code by name.
 *
 * @param code - Code name, e.g. `"NOT_FOUND"`.
 * @returns The record, or `undefined` when it is neither builtin nor registered.
 *
 * @example
 * messageCodeInfo("ORIGIN_NOT_ALLOWED")?.status; // 403
 */
export function messageCodeInfo(code: string): MessageCodeInfo | undefined {
	return registry.get(code);
}
