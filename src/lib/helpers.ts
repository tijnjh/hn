import { formatDistanceToNow } from "date-fns";

export function relativify(uts: number) {
	try {
		const timestamp = uts * 1000;
		const date = new Date(timestamp);
		const formatted = formatDistanceToNow(date, { addSuffix: true });
		return formatted.replace("about", "");
	} catch (error) {
		return;
	}
}

export function formatUrl(url: string) {
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname;
		return hostname.startsWith("www.")
			? hostname.replace("www.", "")
			: hostname;
	} catch (error) {
		return;
	}
}
