import {
	defineStatuses,
	type StatusClass,
	statusClassOfCode,
	type StatusInfo,
} from "../core/define.js";

// IANA HTTP status codes with RFC 9110 reason phrases.
const entries = [
	[
		100,
		"CONTINUE",
		"Continue",
		"The server has received the request headers and the client should proceed to send the request body.",
	],
	[
		101,
		"SWITCHING_PROTOCOLS",
		"Switching Protocols",
		"The requester has asked the server to switch protocols and the server has agreed to do so.",
	],
	[
		102,
		"PROCESSING",
		"Processing",
		"The server has received and is processing the request, but no response is available yet.",
	],
	[
		103,
		"EARLY_HINTS",
		"Early Hints",
		"Used to return some response headers before the final HTTP message.",
	],
	[
		104,
		"UPLOAD_RESUMPTION_SUPPORTED",
		"Upload Resumption Supported",
		"Sent while a request body is being uploaded to announce that the server supports resumable uploads. Registered as a temporary IANA code.",
	],
	[200, "OK", "OK", "The request has succeeded."],
	[
		201,
		"CREATED",
		"Created",
		"The request has been fulfilled and has resulted in the creation of a new resource.",
	],
	[
		202,
		"ACCEPTED",
		"Accepted",
		"The request has been accepted for processing, but processing has not been completed.",
	],
	[
		203,
		"NON_AUTHORITATIVE_INFORMATION",
		"Non-Authoritative Information",
		"The server is a transforming proxy that received a 200 OK from its origin but is returning a modified version of the response.",
	],
	[
		204,
		"NO_CONTENT",
		"No Content",
		"The server successfully processed the request and is not returning any content.",
	],
	[
		205,
		"RESET_CONTENT",
		"Reset Content",
		"The server successfully processed the request and requires the requester to reset the document view.",
	],
	[
		206,
		"PARTIAL_CONTENT",
		"Partial Content",
		"The server is delivering only part of the resource due to a range header sent by the client.",
	],
	[
		207,
		"MULTI_STATUS",
		"Multi-Status",
		"The message body contains separate response codes for multiple sub-requests.",
	],
	[
		208,
		"ALREADY_REPORTED",
		"Already Reported",
		"The members of a DAV binding have already been enumerated in a preceding part of the multistatus response and are not being repeated.",
	],
	[
		226,
		"IM_USED",
		"IM Used",
		"The server fulfilled the request and the response is the result of one or more instance manipulations applied to the current instance.",
	],
	[
		300,
		"MULTIPLE_CHOICES",
		"Multiple Choices",
		"The request has multiple possible responses, each with its own representation.",
	],
	[
		301,
		"MOVED_PERMANENTLY",
		"Moved Permanently",
		"The target resource has been assigned a new permanent URI and all future requests should use it.",
	],
	[
		302,
		"FOUND",
		"Found",
		"The target resource resides temporarily under a different URI.",
	],
	[
		303,
		"SEE_OTHER",
		"See Other",
		"The response to the request can be found under another URI using the GET method.",
	],
	[
		304,
		"NOT_MODIFIED",
		"Not Modified",
		"The resource has not been modified since the version specified by the request headers.",
	],
	[
		305,
		"USE_PROXY",
		"Use Proxy",
		"The requested resource is available only through a proxy, whose address is provided in the response.",
	],
	[
		306,
		"SWITCH_PROXY",
		"Switch Proxy",
		"Reserved and no longer used. Originally meant that subsequent requests should use the specified proxy.",
	],
	[
		307,
		"TEMPORARY_REDIRECT",
		"Temporary Redirect",
		"The request should be repeated with another URI, but future requests should still use the original URI.",
	],
	[
		308,
		"PERMANENT_REDIRECT",
		"Permanent Redirect",
		"The request and all future requests should be repeated using another URI.",
	],
	[
		400,
		"BAD_REQUEST",
		"Bad Request",
		"The server cannot or will not process the request due to an apparent client error.",
	],
	[
		401,
		"UNAUTHORIZED",
		"Unauthorized",
		"Authentication is required and has failed or has not yet been provided.",
	],
	[
		402,
		"PAYMENT_REQUIRED",
		"Payment Required",
		"Reserved for future use by digital payment or micropayment schemes.",
	],
	[
		403,
		"FORBIDDEN",
		"Forbidden",
		"The server understood the request but refuses to authorize it.",
	],
	[
		404,
		"NOT_FOUND",
		"Not Found",
		"The requested resource could not be found but may be available in the future.",
	],
	[
		405,
		"METHOD_NOT_ALLOWED",
		"Method Not Allowed",
		"The request method is not supported for the requested resource.",
	],
	[
		406,
		"NOT_ACCEPTABLE",
		"Not Acceptable",
		"The requested resource can only produce content not acceptable according to the Accept headers.",
	],
	[
		407,
		"PROXY_AUTHENTICATION_REQUIRED",
		"Proxy Authentication Required",
		"The client must first authenticate itself with the proxy.",
	],
	[
		408,
		"REQUEST_TIMEOUT",
		"Request Timeout",
		"The server timed out waiting for the request.",
	],
	[
		409,
		"CONFLICT",
		"Conflict",
		"The request could not be processed because of a conflict in the current state of the resource.",
	],
	[
		410,
		"GONE",
		"Gone",
		"The requested resource is no longer available and will not be available again.",
	],
	[
		411,
		"LENGTH_REQUIRED",
		"Length Required",
		"The request did not specify the length of its content, which is required by the requested resource.",
	],
	[
		412,
		"PRECONDITION_FAILED",
		"Precondition Failed",
		"The server does not meet one of the preconditions that the requester put on the request.",
	],
	[
		413,
		"CONTENT_TOO_LARGE",
		"Content Too Large",
		"The request is larger than the server is willing or able to process.",
	],
	[
		414,
		"URI_TOO_LONG",
		"URI Too Long",
		"The URI provided was too long for the server to process.",
	],
	[
		415,
		"UNSUPPORTED_MEDIA_TYPE",
		"Unsupported Media Type",
		"The request entity has a media type which the server or resource does not support.",
	],
	[
		416,
		"RANGE_NOT_SATISFIABLE",
		"Range Not Satisfiable",
		"The client asked for a portion of the file that the server cannot supply.",
	],
	[
		417,
		"EXPECTATION_FAILED",
		"Expectation Failed",
		"The server cannot meet the requirements of the Expect request header field.",
	],
	[
		418,
		"IM_A_TEAPOT",
		"I'm a teapot",
		"Any attempt to brew coffee with a teapot should result in this status code; the resulting entity body may be short and stout.",
	],
	[
		421,
		"MISDIRECTED_REQUEST",
		"Misdirected Request",
		"The request was directed at a server that is not able to produce a response.",
	],
	[
		422,
		"UNPROCESSABLE_CONTENT",
		"Unprocessable Content",
		"The request was well-formed but was unable to be followed due to semantic errors.",
	],
	[423, "LOCKED", "Locked", "The resource being accessed is locked."],
	[
		424,
		"FAILED_DEPENDENCY",
		"Failed Dependency",
		"The request failed because it depended on another request and that request failed.",
	],
	[
		425,
		"TOO_EARLY",
		"Too Early",
		"The server is unwilling to risk processing a request that might be replayed.",
	],
	[
		426,
		"UPGRADE_REQUIRED",
		"Upgrade Required",
		"The client should switch to a different protocol such as TLS/1.0, given in the Upgrade header field.",
	],
	[
		428,
		"PRECONDITION_REQUIRED",
		"Precondition Required",
		"The origin server requires the request to be conditional.",
	],
	[
		429,
		"TOO_MANY_REQUESTS",
		"Too Many Requests",
		"The user has sent too many requests in a given amount of time.",
	],
	[
		431,
		"REQUEST_HEADER_FIELDS_TOO_LARGE",
		"Request Header Fields Too Large",
		"The server is unwilling to process the request because its header fields are too large.",
	],
	[
		451,
		"UNAVAILABLE_FOR_LEGAL_REASONS",
		"Unavailable For Legal Reasons",
		"A server operator has received a legal demand to deny access to this resource.",
	],
	[
		500,
		"INTERNAL_SERVER_ERROR",
		"Internal Server Error",
		"A generic error message given when an unexpected condition was encountered and no more specific message is suitable.",
	],
	[
		501,
		"NOT_IMPLEMENTED",
		"Not Implemented",
		"The server does not recognize the request method or lacks the ability to fulfil the request.",
	],
	[
		502,
		"BAD_GATEWAY",
		"Bad Gateway",
		"The server, acting as a gateway or proxy, received an invalid response from the upstream server.",
	],
	[
		503,
		"SERVICE_UNAVAILABLE",
		"Service Unavailable",
		"The server is currently unavailable because it is overloaded or down for maintenance.",
	],
	[
		504,
		"GATEWAY_TIMEOUT",
		"Gateway Timeout",
		"The server, acting as a gateway or proxy, did not receive a timely response from the upstream server.",
	],
	[
		505,
		"HTTP_VERSION_NOT_SUPPORTED",
		"HTTP Version Not Supported",
		"The server does not support the HTTP protocol version used in the request.",
	],
	[
		506,
		"VARIANT_ALSO_NEGOTIATES",
		"Variant Also Negotiates",
		"Transparent content negotiation for the request results in a circular reference.",
	],
	[
		507,
		"INSUFFICIENT_STORAGE",
		"Insufficient Storage",
		"The server is unable to store the representation needed to complete the request.",
	],
	[
		508,
		"LOOP_DETECTED",
		"Loop Detected",
		"The server detected an infinite loop while processing the request.",
	],
	[
		510,
		"NOT_EXTENDED",
		"Not Extended",
		"Further extensions to the request are required for the server to fulfil it.",
	],
	[
		511,
		"NETWORK_AUTHENTICATION_REQUIRED",
		"Network Authentication Required",
		"The client needs to authenticate to gain network access.",
	],
] as const satisfies readonly (readonly [number, string, string, string])[];

const statuses = defineStatuses(entries);

/**
 * All 64 IANA-registered HTTP status codes, keyed by identifier.
 *
 * Every record is frozen and carries `code`, `name`, `phrase`, `message`, and
 * `class`. IANA's temporary `104` resumable-upload code is included.
 *
 * @see https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
 *
 * @example
 * HttpStatus.FORBIDDEN.code; // 403
 * HttpStatus.FORBIDDEN.class; // "4xx"
 */
export const HttpStatus = statuses.byName;

/** Canonical values for the five response classes. */
export const StatusClasses = {
	INFORMATIONAL: "1xx",
	SUCCESSFUL: "2xx",
	REDIRECTION: "3xx",
	CLIENT_ERROR: "4xx",
	SERVER_ERROR: "5xx",
} as const satisfies Record<string, StatusClass>;

/**
 * Looks up a standard status by numeric code.
 *
 * @param code - Numeric status code, e.g. `403`.
 * @returns The matching record, or `undefined` for unassigned codes.
 *
 * @example
 * statusByCode(403) === HttpStatus.FORBIDDEN; // true
 * statusByCode(520); // undefined — vendor codes live in their own modules
 */
export function statusByCode(code: number): StatusInfo | undefined {
	return statuses.byCode.get(code);
}

/**
 * Returns the class of a status code or record.
 *
 * @param value - Numeric code or a status record.
 *
 * @example
 * statusClassOf(404); // "4xx"
 * statusClassOf(HttpStatus.OK); // "2xx"
 */
export function statusClassOf(value: number | StatusInfo): StatusClass {
	return typeof value === "number" ? statusClassOfCode(value) : value.class;
}

/** True when the value is in the 1xx (informational) class. */
export function isInformational(value: number | StatusInfo): boolean {
	return statusClassOf(value) === StatusClasses.INFORMATIONAL;
}

/** True when the value is in the 2xx (successful) class. */
export function isSuccess(value: number | StatusInfo): boolean {
	return statusClassOf(value) === StatusClasses.SUCCESSFUL;
}

/** True when the value is in the 3xx (redirection) class. */
export function isRedirection(value: number | StatusInfo): boolean {
	return statusClassOf(value) === StatusClasses.REDIRECTION;
}

/** True when the value is in the 4xx (client error) class. */
export function isClientError(value: number | StatusInfo): boolean {
	return statusClassOf(value) === StatusClasses.CLIENT_ERROR;
}

/** True when the value is in the 5xx (server error) class. */
export function isServerError(value: number | StatusInfo): boolean {
	return statusClassOf(value) === StatusClasses.SERVER_ERROR;
}
