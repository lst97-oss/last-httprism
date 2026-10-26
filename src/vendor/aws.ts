import {
	defineProviderStatuses,
	type ProviderStatusInfo,
	type StatusEntry,
} from "../core/define.js";

/** Provider id stored on {@link AwsStatus} records. */
export const AWS = "aws" as const;

// AWS Application Load Balancer responses that are not standard HTTP codes.
const entries = [
	[
		460,
		"CLIENT_CLOSED_CONNECTION",
		"Client Closed Connection",
		"The load balancer received a request, but the client closed the connection before the idle timeout period elapsed.",
	],
	[
		463,
		"TOO_MANY_FORWARDED_IPS",
		"Too Many Forwarded IP Addresses",
		"The load balancer received an X-Forwarded-For request header with more than 30 IP addresses.",
	],
	[
		464,
		"INCOMPATIBLE_PROTOCOL_VERSION",
		"Incompatible Protocol Version",
		"The request protocol is incompatible with the target group protocol version (for example, HTTP/1.1 against a gRPC target group).",
	],
	[
		561,
		"UNAUTHORIZED",
		"Unauthorized",
		"An authentication listener rule failed because the identity provider returned an error while authenticating the user.",
	],
	[
		562,
		"JWKS_REQUEST_FAILED",
		"JWKS Request Failed",
		"The load balancer could not obtain a successful, valid response from the identity provider's JWKS endpoint.",
	],
] as const satisfies readonly StatusEntry[];

const statuses = defineProviderStatuses(AWS, entries);

/**
 * AWS Application Load Balancer responses that are not standard HTTP codes:
 * 460, 463, 464, 561, and 562.
 *
 * Exported only from `last-httprism/aws`.
 *
 * @see https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-troubleshooting.html
 *
 * @example
 * AwsStatus.CLIENT_CLOSED_CONNECTION.code; // 460
 */
export const AwsStatus = statuses.byName;

/**
 * Looks up an AWS load balancer status by code.
 *
 * @param code - AWS code, e.g. `460`.
 * @returns The record, or `undefined` for codes AWS does not define.
 */
export function statusByCode(code: number): ProviderStatusInfo | undefined {
	return statuses.byCode.get(code);
}
