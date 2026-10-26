import { describe, expect, test } from "bun:test";

import {
	HttpStatus,
	isClientError,
	isInformational,
	isRedirection,
	isServerError,
	isSuccess,
	statusByCode,
	StatusClasses,
	statusClassOf,
} from "../../src/index.js";

const all = Object.values(HttpStatus);

describe("HttpStatus", () => {
	test("contains the 64 IANA codes", () => {
		expect(all).toHaveLength(64);
	});

	test("every name maps to a code that maps back to the same record", () => {
		for (const [name, info] of Object.entries(HttpStatus)) {
			expect(info.name).toBe(name);
			expect(statusByCode(info.code)).toBe(info);
		}
	});

	test("names and codes are unique", () => {
		expect(new Set(Object.keys(HttpStatus)).size).toBe(all.length);
		expect(new Set(all.map((info) => info.code)).size).toBe(all.length);
	});

	test("class matches the code prefix", () => {
		for (const info of all) {
			expect<string>(info.class).toBe(`${Math.floor(info.code / 100)}xx`);
		}
	});

	test("records are frozen", () => {
		expect(Object.isFrozen(HttpStatus.FORBIDDEN)).toBe(true);
	});

	test("uses RFC 9110 phrases for renamed codes", () => {
		expect(HttpStatus.CONTENT_TOO_LARGE.code).toBe(413);
		expect(HttpStatus.URI_TOO_LONG.code).toBe(414);
		expect(HttpStatus.RANGE_NOT_SATISFIABLE.code).toBe(416);
		expect(HttpStatus.UNPROCESSABLE_CONTENT.phrase).toBe(
			"Unprocessable Content",
		);
		expect(HttpStatus.IM_A_TEAPOT.code).toBe(418);
	});

	test("matches the IANA registry including the temporary 104 code", () => {
		expect(HttpStatus.UPLOAD_RESUMPTION_SUPPORTED).toEqual({
			code: 104,
			name: "UPLOAD_RESUMPTION_SUPPORTED",
			phrase: "Upload Resumption Supported",
			message:
				"Sent while a request body is being uploaded to announce that the server supports resumable uploads. Registered as a temporary IANA code.",
			class: "1xx",
		});
		expect(HttpStatus.REQUEST_TIMEOUT.phrase).toBe("Request Timeout");
		expect(HttpStatus.GATEWAY_TIMEOUT.phrase).toBe("Gateway Timeout");
		expect(HttpStatus.HTTP_VERSION_NOT_SUPPORTED.phrase).toBe(
			"HTTP Version Not Supported",
		);
		expect(HttpStatus.MULTI_STATUS.phrase).toBe("Multi-Status");
	});

	test("unknown codes return undefined", () => {
		expect(statusByCode(999)).toBeUndefined();
		expect(statusByCode(1030)).toBeUndefined();
	});

	test("class predicates and helpers", () => {
		expect(statusClassOf(200)).toBe(StatusClasses.SUCCESSFUL);
		expect(statusClassOf(HttpStatus.NOT_FOUND)).toBe("4xx");
		expect(isInformational(103)).toBe(true);
		expect(isSuccess(204)).toBe(true);
		expect(isRedirection(302)).toBe(true);
		expect(isClientError(HttpStatus.FORBIDDEN)).toBe(true);
		expect(isServerError(500)).toBe(true);
		expect(isSuccess(500)).toBe(false);
	});
});
