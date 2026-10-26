# @lst97-oss/last-httprism

Typed, zero-dependency lookups for HTTP status codes, headers, methods, media types, and machine-readable message codes. Vendor status codes (Cloudflare, Nginx) ship as isolated subpath exports and never mix with the standard registry.

## Install

```sh
bun add @lst97-oss/last-httprism
# npm install @lst97-oss/last-httprism / pnpm add @lst97-oss/last-httprism
```

ESM package, Node 20.19+ (`require()` of the ESM build also works there).

## Usage

Every namespace is a frozen, literal-typed record. Statuses carry their class and a default message.

```ts
import {
	HttpStatus,
	MediaType,
	MessageCode,
	statusByCode,
} from "@lst97-oss/last-httprism";

HttpStatus.FORBIDDEN;
// { code: 403, name: "FORBIDDEN", phrase: "Forbidden",
//   message: "The server understood the request but refuses to authorize it.", class: "4xx" }

statusByCode(403); // the same record, or undefined for unknown codes
```

Feed your own error constructor:

```ts
class HttpError extends Error {
	constructor(
		readonly status: number,
		readonly code: string,
		message: string,
	) {
		super(message);
	}
}

throw new HttpError(
	HttpStatus.FORBIDDEN.code,
	MessageCode.ORIGIN_NOT_ALLOWED.code,
	MessageCode.ORIGIN_NOT_ALLOWED.message,
);
// HttpError { status: 403, code: "ORIGIN_NOT_ALLOWED",
//             message: "The request origin is not allowed." }
```

Helpers:

```ts
import {
	isClientError,
	isSuccess,
	statusClassOf,
} from "@lst97-oss/last-httprism";

statusClassOf(404); // "4xx"
isSuccess(204); // true
isClientError(HttpStatus.FORBIDDEN); // true
```

Other registries:

```ts
import {
	HttpHeader,
	HttpMethod,
	MediaType,
	methodInfo,
} from "@lst97-oss/last-httprism";

HttpHeader.CONTENT_TYPE; // "Content-Type"
methodInfo("post")?.idempotent; // false
MediaType.PROBLEM_JSON; // "application/problem+json"
```

## Custom message codes

Build a frozen, typo-checked table for host-specific codes with `defineMessageCodes`. Builtins are merged in and never mutated.

```ts
import {
	defineMessageCodes,
	lookupMessageCode,
} from "@lst97-oss/last-httprism";

const AppCode = defineMessageCodes({
	QUOTA_EXCEEDED: {
		status: 429,
		message: "The workspace quota has been exhausted.",
	},
});

AppCode.QUOTA_EXCEEDED.code; // "QUOTA_EXCEEDED" — literal, typo-checked
AppCode.NOT_FOUND.code; // builtins are merged in
lookupMessageCode(AppCode, name); // MessageCodeInfo | undefined
```

Pass an object literal (or `as const`) so keys stay literal; passing a widened `MessageCodeDefinitions` variable gives a string-indexed table. A definition that shadows a builtin throws unless you pass `{ override: true }`.

## Vendor status codes

Vendor codes live in their own modules and are never merged into `HttpStatus`. Each record carries a `provider` field.

```ts
import { AwsStatus } from "@lst97-oss/last-httprism/aws";
import { CloudflareStatus } from "@lst97-oss/last-httprism/cloudflare";
import { IisStatus } from "@lst97-oss/last-httprism/iis";
import { NginxStatus } from "@lst97-oss/last-httprism/nginx";
import { UnofficialStatus } from "@lst97-oss/last-httprism/unofficial";

CloudflareStatus.CONNECTION_TIMED_OUT;
// { code: 522, name: "CONNECTION_TIMED_OUT", phrase: "Connection Timed Out",
//   message: "...", class: "5xx", provider: "cloudflare" }

NginxStatus.NO_RESPONSE.code; // 444
AwsStatus.CLIENT_CLOSED_CONNECTION.code; // 460
IisStatus.REDIRECT.code; // 451 (standard 451 still means legal reasons)
UnofficialStatus.PAGE_EXPIRED.code; // 419
```

Available subpaths:

| Subpath                               | Provider     | Codes                                        |
| ------------------------------------- | ------------ | -------------------------------------------- |
| `@lst97-oss/last-httprism/cloudflare` | `cloudflare` | 520–526, 530, historical 527                 |
| `@lst97-oss/last-httprism/nginx`      | `nginx`      | 444, 494–497, 499                            |
| `@lst97-oss/last-httprism/aws`        | `aws`        | ALB: 460, 463, 464, 561, 562                 |
| `@lst97-oss/last-httprism/iis`        | `iis`        | 440, 449, 451 (Exchange ActiveSync redirect) |
| `@lst97-oss/last-httprism/unofficial` | `unofficial` | 218, 419, 420, 509, 599 — unassigned by IANA |

### Adding a vendor

Copy `src/vendor/nginx.ts`, swap the provider id and the entries, then add the file to `entry` in `tsup.config.ts` and an `exports` subpath in `package.json`. `defineProviderStatuses` validates nothing at runtime, so keep codes and messages accurate to the vendor's docs.

## Structure

```
src/
  core/define.ts        # tuple -> frozen record builders shared by all statuses
  http/statuses.ts      # 64 IANA statuses (incl. temporary 104) + class helpers
  http/headers.ts       # 118 registered header names
  http/methods.ts       # 38 registered methods with safe/idempotent/cacheable
  http/media-types.ts   # curated common media types
  http/message-codes.ts # builtin message codes + host registry
  vendor/cloudflare.ts  # extension data, exported only via @lst97-oss/last-httprism/cloudflare
  vendor/nginx.ts       # ... and one module per vendor subpath
  vendor/aws.ts
  vendor/iis.ts
  vendor/unofficial.ts
  index.ts              # standard barrel; never re-exports vendor modules
```

Reference phrases follow the IANA registry (last updated 2025-09-15); 104 is IANA's temporary resumable-upload code. Cloudflare data follows its 5xx error docs (520–526, 530, plus historical 527); nginx data follows its internal `NGX_HTTP_*` codes (444, 494–497, 499); AWS data follows the Application Load Balancer troubleshooting docs; IIS data follows IIS and `[MS-ASHTTP]` ActiveSync; unofficial codes are sourced per entry and unassigned by IANA. Fastly's `462` is intentionally omitted — it has no primary-source documentation.

## License

MIT
