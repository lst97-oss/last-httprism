/**
 * Typed, zero-dependency HTTP lookups: status codes, headers, methods, media
 * types, and machine-readable message codes.
 *
 * Vendor codes (Cloudflare, nginx, AWS, IIS, unofficial) are exported from
 * their own subpaths and are never re-exported here.
 *
 * @packageDocumentation
 */
export {
	defineProviderStatuses,
	defineStatuses,
	type ProviderStatusInfo,
	type ProviderStatusTable,
	type StatusClass,
	type StatusEntry,
	type StatusInfo,
	type StatusTable,
	statusClassOfCode,
} from "./core/define.js";
export { canonicalHeaderName, HttpHeader } from "./http/headers.js";
export { MediaType } from "./http/media-types.js";
export {
	MessageCode,
	type MessageCodeDefinition,
	type MessageCodeDefinitions,
	type MessageCodeInfo,
	messageCodeInfo,
	registerMessageCodes,
} from "./http/message-codes.js";
export {
	HttpMethod,
	type HttpMethodKey,
	type HttpMethodName,
	type MethodInfo,
	methodInfo,
} from "./http/methods.js";
export {
	HttpStatus,
	isClientError,
	isInformational,
	isRedirection,
	isServerError,
	isSuccess,
	StatusClasses,
	statusByCode,
	statusClassOf,
} from "./http/statuses.js";
