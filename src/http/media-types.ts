/**
 * Curated set of common IANA media types, keyed by short identifier.
 *
 * The full IANA registry is intentionally excluded to keep the package small.
 *
 * @example
 * MediaType.JSON; // "application/json"
 * MediaType.PROBLEM_JSON; // "application/problem+json"
 */
export const MediaType = Object.freeze({
	JSON: "application/json",
	PROBLEM_JSON: "application/problem+json",
	PROBLEM_XML: "application/problem+xml",
	XML: "application/xml",
	FORM_URLENCODED: "application/x-www-form-urlencoded",
	OCTET_STREAM: "application/octet-stream",
	PDF: "application/pdf",
	ZIP: "application/zip",
	GZIP: "application/gzip",
	JAVASCRIPT: "application/javascript",
	WASM: "application/wasm",
	FORM_DATA: "multipart/form-data",
	MULTIPART_BYTERANGES: "multipart/byteranges",
	TEXT: "text/plain",
	HTML: "text/html",
	CSS: "text/css",
	CSV: "text/csv",
	TEXT_JAVASCRIPT: "text/javascript",
	TEXT_XML: "text/xml",
	MARKDOWN: "text/markdown",
	EVENT_STREAM: "text/event-stream",
	PNG: "image/png",
	JPEG: "image/jpeg",
	GIF: "image/gif",
	WEBP: "image/webp",
	AVIF: "image/avif",
	SVG: "image/svg+xml",
	ICON: "image/x-icon",
	ICON_MS: "image/vnd.microsoft.icon",
	MP3: "audio/mpeg",
	WAV: "audio/wav",
	AUDIO_OGG: "audio/ogg",
	AUDIO_WEBM: "audio/webm",
	AUDIO_MP4: "audio/mp4",
	VIDEO_MP4: "video/mp4",
	VIDEO_MPEG: "video/mpeg",
	VIDEO_WEBM: "video/webm",
	VIDEO_OGG: "video/ogg",
	QUICKTIME: "video/quicktime",
	AVI: "video/x-msvideo",
	WOFF: "font/woff",
	WOFF2: "font/woff2",
	TTF: "font/ttf",
	OTF: "font/otf",
} as const);
