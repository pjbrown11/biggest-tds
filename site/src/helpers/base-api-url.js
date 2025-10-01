let properUrl = "";
let host = "";

if (typeof window !== "undefined") {
	host = window.location.hostname;
}

if ((typeof process !== "undefined" && process.env.NODE_ENV === "development") || host.includes("localhost") || host.includes("127.0")) {
	properUrl = "http://127.0.0.1:5001/goat-starter-test/us-central1";
} else if ((typeof process !== "undefined" && process.env.FIREBASE_PROJECT === "goat-starter-test") || host.includes("test")) {
	properUrl = "https://us-central1-goat-starter-test.cloudfunctions.net";
} else if (
	(typeof process !== "undefined" && process.env.FIREBASE_PROJECT === "goat-starter") ||
	host.includes("bondurantchamber") ||
	host.includes("goat-starter.")
) {
	properUrl = "https://us-central1-goat-starter.cloudfunctions.net";
}

export const baseApiUrl = properUrl;
