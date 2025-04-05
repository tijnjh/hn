<script lang="ts">
	import { fetchStories, fetchStoryIds } from '$lib/helpers';
	import { AppBar, Segment } from '@skeletonlabs/skeleton-svelte';
	import { GithubIcon } from '@lucide/svelte/icons';
	import StoryListing from '$lib/components/StoryListing.svelte';
	import { browser } from '$app/environment';

	let stories: any[] = $state([]);
	let page = $state(1);
	let isLoading = $state(true);
	let sort = $state('top');

	$effect(() => {
		loadStories(page);
	});

	async function loadStories(page: number) {
		try {
			const storyIds = await fetchStoryIds(page, 25);
			const fetchedStories = await fetchStories(storyIds);
			stories = [...stories, ...fetchedStories];
		} catch (error) {
			console.error('Failed to load stories:', error);
		} finally {
			isLoading = false;
		}
	}

	function loadMore() {
		isLoading = true;
		loadStories(++page).then(() => {
			isLoading = false;
		});
	}
</script>

<svelte:window
	onscroll={() => {
		if (!browser) return;

		if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
			loadMore();
		}
	}}
/>

<AppBar classes="sticky top-0 z-50">
	{#snippet lead()}
		<Segment name="align" value={sort} onValueChange={(e) => (sort = e.value || '')}>
			<Segment.Item value="top">Top</Segment.Item>
			<Segment.Item value="new">New</Segment.Item>
		</Segment>
	{/snippet}
	{#snippet trail()}
		<a href="https://github.com/tijnjh/hn" class="btn">
			<span>Source</span>
			<GithubIcon size={18} />
		</a>
	{/snippet}
</AppBar>

<div class="grid w-full grid-cols-1 gap-4 p-4 md:grid-cols-2 lg:grid-cols-3">
	{#each stories as story}
		<StoryListing {story} />
	{/each}
	{#if isLoading}
		{#each { length: 25 }, i}
			{@const random = Math.random() >= 0.5}
			<div
				class="card preset-filled-surface-100-900 border-surface-200-800 block flex w-full cursor-wait items-center gap-4 overflow-clip border p-4"
			>
				<div class="placeholder-circle size-10 animate-pulse"></div>

				<div class="w-full">
					<div class="placeholder mb-2 w-full animate-pulse"></div>

					<div class:hidden={i % 2 === 0} class="placeholder mb-2 w-1/3 animate-pulse"></div>

					<div class="placeholder w-full animate-pulse"></div>
				</div>
			</div>
		{/each}
	{/if}
</div>
