<script lang="ts">
	import type { ChecklistItem } from '@/shared/api';
	import ChecklistItemCard from './checklist-item-card.svelte';

	let {
		items,
		canEdit = false,
		canReview = false,
		onupdate,
	}: {
		items: ChecklistItem[];
		canEdit?: boolean;
		canReview?: boolean;
		onupdate: () => void;
	} = $props();

	const grouped = $derived(
		items.reduce(
			(acc, item) => {
				const cat = item.category || 'Общее';
				if (!acc[cat]) acc[cat] = [];
				acc[cat].push(item);
				return acc;
			},
			{} as Record<string, ChecklistItem[]>
		)
	);
</script>

<div class="flex flex-col gap-6">
	{#each Object.entries(grouped) as [category, categoryItems]}
		<div>
			<h3 class="mb-3 text-sm font-semibold uppercase text-muted-foreground">{category}</h3>
			<div class="flex flex-col gap-2">
				{#each categoryItems as item}
					<ChecklistItemCard {item} {canEdit} {canReview} {onupdate} />
				{/each}
			</div>
		</div>
	{/each}
</div>
