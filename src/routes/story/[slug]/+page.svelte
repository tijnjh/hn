<script lang="ts">
	import { page } from '$app/state';
	import StoryListing from '$lib/components/StoryListing.svelte';

	async function fetchStory(id: number) {
		const url = `https://node-hnapi.herokuapp.com/item/${id}`;
		const response = await (await fetch(url)).json();
		return response;
	}
</script>

{#await fetchStory(Number(page.params.slug))}
	loading
{:then story}
	<StoryListing {story} href={story.url} />
{/await}
