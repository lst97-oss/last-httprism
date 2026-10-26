import { describe, expect, test } from "bun:test";

import { HttpStatus, statusByCode } from "../../src/index.js";
import {
	AWS,
	AwsStatus,
	statusByCode as awsStatusByCode,
} from "../../src/vendor/aws.js";
import {
	CLOUDFLARE,
	CloudflareStatus,
	statusByCode as cloudflareStatusByCode,
} from "../../src/vendor/cloudflare.js";
import {
	IIS,
	IisStatus,
	statusByCode as iisStatusByCode,
} from "../../src/vendor/iis.js";
import {
	NGINX,
	NginxStatus,
	statusByCode as nginxStatusByCode,
} from "../../src/vendor/nginx.js";
import {
	statusByCode as unofficialStatusByCode,
	UNOFFICIAL,
	UnofficialStatus,
} from "../../src/vendor/unofficial.js";

describe("Cloudflare extension", () => {
	test("exposes its documented codes with the provider tag", () => {
		expect(CLOUDFLARE).toBe("cloudflare");
		expect(Object.keys(CloudflareStatus)).toHaveLength(9);
		expect(CloudflareStatus.UNKNOWN_ERROR.code).toBe(520);
		expect(CloudflareStatus.CONNECTION_TIMED_OUT.code).toBe(522);
		expect(CloudflareStatus.ORIGIN_DNS_ERROR.code).toBe(530);
		expect(CloudflareStatus.UNKNOWN_ERROR.provider).toBe("cloudflare");
		expect(cloudflareStatusByCode(524)?.phrase).toBe("A Timeout Occurred");
		expect(cloudflareStatusByCode(530)?.phrase).toBe("Origin DNS Error");
		expect(cloudflareStatusByCode(200)).toBeUndefined();
	});
});

describe("Nginx extension", () => {
	test("exposes its 6 codes with the provider tag", () => {
		expect(NGINX).toBe("nginx");
		expect(Object.keys(NginxStatus)).toHaveLength(6);
		expect(NginxStatus.NO_RESPONSE.code).toBe(444);
		expect(NginxStatus.CLIENT_CLOSED_REQUEST.code).toBe(499);
		expect(NginxStatus.NO_RESPONSE.provider).toBe("nginx");
		expect(nginxStatusByCode(499)?.phrase).toBe("Client Closed Request");
		expect(nginxStatusByCode(404)).toBeUndefined();
	});
});

describe("AWS load balancer extension", () => {
	test("exposes the ALB codes with the provider tag", () => {
		expect(AWS).toBe("aws");
		expect(Object.keys(AwsStatus)).toHaveLength(5);
		expect(AwsStatus.CLIENT_CLOSED_CONNECTION.code).toBe(460);
		expect(AwsStatus.TOO_MANY_FORWARDED_IPS.code).toBe(463);
		expect(AwsStatus.INCOMPATIBLE_PROTOCOL_VERSION.code).toBe(464);
		expect(AwsStatus.JWKS_REQUEST_FAILED.code).toBe(562);
		expect(AwsStatus.JWKS_REQUEST_FAILED.provider).toBe("aws");
		expect(awsStatusByCode(561)?.phrase).toBe("Unauthorized");
		expect(awsStatusByCode(463)?.class).toBe("4xx");
		expect(awsStatusByCode(404)).toBeUndefined();
	});
});

describe("IIS extension", () => {
	test("exposes the IIS and ActiveSync codes", () => {
		expect(IIS).toBe("iis");
		expect(Object.keys(IisStatus)).toHaveLength(3);
		expect(IisStatus.LOGIN_TIME_OUT.code).toBe(440);
		expect(IisStatus.RETRY_WITH.code).toBe(449);
		expect(IisStatus.REDIRECT.code).toBe(451);
		expect(IisStatus.REDIRECT.provider).toBe("iis");
		expect(iisStatusByCode(451)?.phrase).toBe("Redirect");
	});

	test("451 coexists with the standard legal-reasons code", () => {
		expect(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS.code).toBe(451);
		expect(IisStatus.REDIRECT.code).toBe(451);
		expect(statusByCode(451)).toBe(HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS);
	});
});

describe("Unofficial codes extension", () => {
	test("exposes the wild codes with the provider tag", () => {
		expect(UNOFFICIAL).toBe("unofficial");
		expect(Object.keys(UnofficialStatus)).toHaveLength(5);
		expect(UnofficialStatus.PAGE_EXPIRED.code).toBe(419);
		expect(UnofficialStatus.ENHANCE_YOUR_CALM.code).toBe(420);
		expect(UnofficialStatus.BANDWIDTH_LIMIT_EXCEEDED.code).toBe(509);
		expect(UnofficialStatus.NETWORK_CONNECT_TIMEOUT.code).toBe(599);
		expect(UnofficialStatus.THIS_IS_FINE.code).toBe(218);
		expect(UnofficialStatus.PAGE_EXPIRED.provider).toBe("unofficial");
		expect(unofficialStatusByCode(599)?.phrase).toBe(
			"Network Connect Timeout Error",
		);
		expect(unofficialStatusByCode(404)).toBeUndefined();
	});
});

describe("standard and vendor namespaces are isolated", () => {
	test("vendor codes never resolve from the standard lookup", () => {
		const vendorMaps = [
			CloudflareStatus,
			NginxStatus,
			AwsStatus,
			IisStatus,
			UnofficialStatus,
		];
		for (const map of vendorMaps) {
			for (const info of Object.values(map)) {
				if (info.code === HttpStatus.UNAVAILABLE_FOR_LEGAL_REASONS.code) {
					continue; // IIS 451 is an intentional collision; asserted above.
				}
				expect(statusByCode(info.code)).toBeUndefined();
			}
		}
	});
});
