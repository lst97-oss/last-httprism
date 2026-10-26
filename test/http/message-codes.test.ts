import { describe, expect, test } from "bun:test";

import {
	HttpStatus,
	MessageCode,
	messageCodeInfo,
	registerMessageCodes,
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
		for (const [key, info] of Object.entries(MessageCode).slice(
			0,
			builtins.length,
		)) {
			expect(info.code).toBe(key);
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

	test("messageCodeInfo resolves builtins", () => {
		expect(messageCodeInfo("ORIGIN_NOT_ALLOWED")).toBe(
			MessageCode.ORIGIN_NOT_ALLOWED,
		);
		expect(messageCodeInfo("NOT_REGISTERED")).toBeUndefined();
	});

	test("host codes register into the same lookup", () => {
		registerMessageCodes({
			QUOTA_EXCEEDED: {
				status: 429,
				message: "The workspace quota has been exhausted.",
			},
		});
		expect(MessageCode.QUOTA_EXCEEDED.status).toBe(429);
		expect(messageCodeInfo("QUOTA_EXCEEDED")?.message).toBe(
			"The workspace quota has been exhausted.",
		);
	});

	test("duplicate registration throws", () => {
		expect(() =>
			registerMessageCodes({
				QUOTA_EXCEEDED: { status: 400, message: "duplicate" },
			}),
		).toThrow(
			'@lst97-oss/last-httprism: message code "QUOTA_EXCEEDED" is already registered',
		);
		expect(() =>
			registerMessageCodes({
				NOT_FOUND: { status: 404, message: "cannot shadow a builtin" },
			}),
		).toThrow("already registered");
	});

	test("override replaces an existing code", () => {
		registerMessageCodes(
			{ QUOTA_EXCEEDED: { status: 403, message: "Replaced." } },
			{ override: true },
		);
		expect(MessageCode.QUOTA_EXCEEDED.status).toBe(403);
		expect(messageCodeInfo("QUOTA_EXCEEDED")?.message).toBe("Replaced.");
	});
});
