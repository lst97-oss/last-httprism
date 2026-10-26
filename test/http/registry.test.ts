import { describe, expect, test } from "bun:test";

import {
	canonicalHeaderName,
	HttpHeader,
	HttpMethod,
	MediaType,
	methodInfo,
} from "../../src/index.js";

describe("HttpHeader", () => {
	test("carries all 118 registered names", () => {
		expect(Object.keys(HttpHeader)).toHaveLength(118);
	});

	test("values are canonical and unique", () => {
		const values = Object.values(HttpHeader);
		expect(HttpHeader.CONTENT_TYPE).toBe("Content-Type");
		expect(HttpHeader.HTTP2_SETTINGS).toBe("HTTP2-Settings");
		expect(HttpHeader.WWW_AUTHENTICATE).toBe("WWW-Authenticate");
		expect(new Set(values).size).toBe(values.length);
	});

	test("canonicalHeaderName is case-insensitive", () => {
		expect(canonicalHeaderName("content-type")).toBe("Content-Type");
		expect(canonicalHeaderName("CONTENT-TYPE")).toBe("Content-Type");
		expect(canonicalHeaderName("X-Not-Registered")).toBeUndefined();
	});
});

describe("HttpMethod", () => {
	test("carries all 38 registered methods", () => {
		expect(Object.keys(HttpMethod)).toHaveLength(38);
	});

	test("keys are valid identifiers and values are uppercase", () => {
		for (const [key, method] of Object.entries(HttpMethod)) {
			expect(key).toMatch(/^[A-Z][A-Z0-9_]*$/);
			expect<string>(method).toBe(method.toUpperCase());
		}
		expect(HttpMethod.BASELINE_CONTROL).toBe("BASELINE-CONTROL");
	});

	test("methodInfo is case-insensitive and reports semantics", () => {
		expect(methodInfo("get")?.safe).toBe(true);
		expect(methodInfo("HEAD")?.cacheable).toBe(true);
		expect(methodInfo("POST")?.idempotent).toBe(false);
		expect(methodInfo("DELETE")?.idempotent).toBe(true);
		expect(methodInfo("PATCH")?.safe).toBe(false);
		expect(methodInfo("NOPE")).toBeUndefined();
	});
});

describe("MediaType", () => {
	test("carries the curated set", () => {
		expect(Object.keys(MediaType)).toHaveLength(44);
		expect(MediaType.JSON).toBe("application/json");
		expect(MediaType.PROBLEM_JSON).toBe("application/problem+json");
		expect(MediaType.SVG).toBe("image/svg+xml");
		expect(MediaType.WOFF2).toBe("font/woff2");
	});

	test("values are unique and well-formed", () => {
		const values = Object.values(MediaType);
		expect(new Set(values).size).toBe(values.length);
		for (const value of values) {
			expect(value).toMatch(/^[a-z]+\/[a-z0-9.+*-]+$/);
		}
	});
});
