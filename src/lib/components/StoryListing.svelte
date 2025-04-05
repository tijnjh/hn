<script lang="ts">
	import { formatUrl, relativify } from '$lib/helpers';
	import { ArrowRightIcon } from '@lucide/svelte/icons';

	const { story, href }: { story: any; href?: string } = $props();
</script>

<div
	class="card preset-filled-surface-100-900 border-surface-200-800 divide-surface-200-800 block divide-y overflow-clip border"
>
	<a
		href={href ?? `/story/${story.id}`}
		class=" preset-filled-surface-100-900 card-hover flex h-20 items-center gap-4 px-4"
	>
		<img
			alt=""
			src={`https://www.google.com/s2/favicons?domain=${story.url}&sz=64`}
			class="size-10 rounded"
		/>
		<h3 class="line-clamp-2">{story.title}</h3>
	</a>

	<footer class="flex items-center justify-between gap-4 py-2 pr-2 pl-4">
		<div class="truncate opacity-60">
			{story.score}
			<span>&bull;</span>
			<span>{relativify(story.time)}</span>
		</div>
		{#if story.url}
			<a href={story.url} class="btn preset-tonal">
				<span>{formatUrl(story.url)}</span>
				<ArrowRightIcon size={18} />
			</a>
		{/if}
	</footer>
</div>
