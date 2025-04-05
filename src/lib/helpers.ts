import { formatDistanceToNow } from 'date-fns';

export async function fetchStoryIds(page: number, storiesPerPage: number) {
	const url = 'https://hacker-news.firebaseio.com/v0/topstories.json';
	const response = await (await fetch(url)).json();
	const start = (page - 1) * storiesPerPage;
	return response.slice(start, start + storiesPerPage);
}

export async function fetchStories(ids: number[]) {
	const baseUrl = 'https://hacker-news.firebaseio.com/v0/item/';
	const fetchPromises = ids.map((id) => fetch(`${baseUrl}${id}.json`).then((res) => res.json()));
	return Promise.all(fetchPromises);
}

export function relativify(uts: number) {
	try {
		const timestamp = uts * 1000;
		const date = new Date(timestamp);
		const formatted = formatDistanceToNow(date, { addSuffix: true });
		return formatted.replace('about', '');
	} catch (err) {
		console.error(err);
		return;
	}
}

export function formatUrl(url: string) {
	try {
		const urlObj = new URL(url);
		const hostname = urlObj.hostname;
		return hostname.startsWith('www.') ? hostname.replace('www.', '') : hostname;
	} catch (err) {
		console.error(err);
		return;
	}
}
