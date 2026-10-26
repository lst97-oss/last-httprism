import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
		aws: "src/vendor/aws.ts",
		cloudflare: "src/vendor/cloudflare.ts",
		iis: "src/vendor/iis.ts",
		nginx: "src/vendor/nginx.ts",
		unofficial: "src/vendor/unofficial.ts",
	},
	outDir: "dist",
	clean: true,
	format: ["esm"],
	target: "esnext",
	minify: true,
	sourcemap: false,
	splitting: true,
});
