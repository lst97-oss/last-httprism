import { expect, test } from "bun:test";

import * as http from "../src/index.js";

test("the barrel exposes only the standard namespaces", () => {
	expect("CloudflareStatus" in http).toBe(false);
	expect("NginxStatus" in http).toBe(false);
	expect("CLOUDFLARE" in http).toBe(false);
	expect("NGINX" in http).toBe(false);
});

test("a host builds an error from pure lookups", () => {
	class HttpError extends Error {
		constructor(
			readonly status: number,
			readonly code: string,
			readonly detail: string,
		) {
			super(detail);
		}
	}

	const error = new HttpError(
		http.HttpStatus.FORBIDDEN.code,
		http.MessageCode.ORIGIN_NOT_ALLOWED.code,
		http.MessageCode.ORIGIN_NOT_ALLOWED.message,
	);

	expect(error.status).toBe(403);
	expect(error.code).toBe("ORIGIN_NOT_ALLOWED");
	expect(error.message).toBe("The request origin is not allowed.");
	expect(http.MediaType.PROBLEM_JSON).toBe("application/problem+json");
	expect(http.HttpHeader.CONTENT_TYPE).toBe("Content-Type");
	expect(http.HttpMethod.GET).toBe("GET");
});
