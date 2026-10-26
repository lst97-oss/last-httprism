import { describe, expect, test } from "bun:test";

import {
	defineMessageCodes,
	HttpStatus,
	lookupMessageCode,
	MessageCode,
	statusByCode,
} from "../../src/index.js";

const builtins = Object.values(MessageCode);

describe("MessageCode", () => {
	test("ships the 22 builtin codes", () => {
		expect(builtins).toHaveLength(22);
	});

	test("every builtin status is a known HTTP status", () => {
		for (const info of builtins) {
			expect(statusByCode(info.status)).toBeDefined();
		}
	});

	test("codes are injected from their key", () => {
		for (const [key, info] of Object.entries(MessageCode)) {
			expect<string>(info.code).toBe(key);
		}
		expect(MessageCode.ORIGIN_NOT_ALLOWED).toEqual({
			code: "ORIGIN_NOT_ALLOWED",
			status: 403,
			message: "The request origin is not allowed.",
		});
		expect(MessageCode.ORIGIN_NOT_ALLOWED.status).toBe(
			HttpStatus.FORBIDDEN.code,
		);
	});

	test("builtins are frozen", () => {
		expect(Object.isFrozen(MessageCode)).toBe(true);
		expect(Object.isFrozen(MessageCode.NOT_FOUND)).toBe(true);
	});
});

describe("defineMessageCodes", () => {
	const AppCode = defineMessageCodes({
		QUOTA_EXCEEDED: {
			status: 429,
			message: "The workspace quota has been exhausted.",
		},
	});

	test("merges builtins and host codes with injected keys", () => {
		expect(AppCode.NOT_FOUND.code).toBe("NOT_FOUND");
		expect(AppCode.QUOTA_EXCEEDED).toEqual({
			code: "QUOTA_EXCEEDED",
			status: 429,
			message: "The workspace quota has been exhausted.",
		});
		expect(Object.isFrozen(AppCode)).toBe(true);
		expect(Object.isFrozen(AppCode.QUOTA_EXCEEDED)).toBe(true);
	});

	test("duplicate builtin names throw unless override is set", () => {
		expect(() =>
			defineMessageCodes({
				NOT_FOUND: { status: 404, message: "cannot shadow a builtin" },
			}),
		).toThrow(
			'@lst97-oss/last-httprism: message code "NOT_FOUND" is already registered',
		);

		const overridden = defineMessageCodes(
			{ NOT_FOUND: { status: 410, message: "Gone now." } },
			{ override: true },
		);
		expect(overridden.NOT_FOUND.status).toBe(410);
		expect(MessageCode.NOT_FOUND.status).toBe(HttpStatus.NOT_FOUND.code);
		expect(MessageCode.NOT_FOUND.message).toBe(
			"The requested resource could not be found.",
		);
	});

	test("tables are independent", () => {
		const first = defineMessageCodes({
			SHARED_KEY: { status: 400, message: "first" },
		});
		const second = defineMessageCodes({
			SHARED_KEY: { status: 409, message: "second" },
		});
		expect(first.SHARED_KEY.message).toBe("first");
		expect(second.SHARED_KEY.message).toBe("second");
		expect(lookupMessageCode(first, "SHARED_KEY")).toBe(first.SHARED_KEY);
		expect(lookupMessageCode(second, "SHARED_KEY")).toBe(second.SHARED_KEY);
	});
});

describe("lookupMessageCode", () => {
	const AppCode = defineMessageCodes({
		QUOTA_EXCEEDED: { status: 429, message: "quota" },
	});

	test("returns own entries by identity", () => {
		expect(lookupMessageCode(MessageCode, "ORIGIN_NOT_ALLOWED")).toBe(
			MessageCode.ORIGIN_NOT_ALLOWED,
		);
		expect(lookupMessageCode(AppCode, "QUOTA_EXCEEDED")).toBe(
			AppCode.QUOTA_EXCEEDED,
		);
	});

	test("returns undefined for unknown and inherited keys", () => {
		expect(lookupMessageCode(AppCode, "NOT_REGISTERED")).toBeUndefined();
		expect(lookupMessageCode(AppCode, "toString")).toBeUndefined();
		expect(lookupMessageCode(AppCode, "hasOwnProperty")).toBeUndefined();
	});
});
