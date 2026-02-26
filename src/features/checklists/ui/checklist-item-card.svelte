<script lang="ts">
	import type { ChecklistItem } from '@/shared/api';
	import { ChecklistStatus } from '@/shared/api/types';
	import { apiUpdateChecklistItem, apiReviewChecklistItem } from '@/shared/api';
	import { Card, CardContent } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import { Input } from '@/shared/ui/input';
	import { Badge } from '@/shared/ui/badge';

	let {
		item,
		canEdit = false,
		canReview = false,
		onupdate,
	}: {
		item: ChecklistItem;
		canEdit?: boolean;
		canReview?: boolean;
		onupdate: () => void;
	} = $props();

	let result = $state(item.result ?? '');
	let notes = $state(item.notes ?? '');
	let isSaving = $state(false);

	const statusBadge: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
		[ChecklistStatus.PENDING]: { label: 'Ожидает', variant: 'outline' },
		[ChecklistStatus.IN_PROGRESS]: { label: 'В работе', variant: 'secondary' },
		[ChecklistStatus.COMPLETED]: { label: 'Завершено', variant: 'default' },
		[ChecklistStatus.REJECTED]: { label: 'Отклонено', variant: 'destructive' },
		[ChecklistStatus.EXPIRED]: { label: 'Истекло', variant: 'destructive' },
	};

	async function save() {
		isSaving = true;
		try {
			await apiUpdateChecklistItem(item.id, {
				result: result || undefined,
				notes: notes || undefined,
				status: ChecklistStatus.COMPLETED,
			});
			onupdate();
		} catch { /* handled by parent */ } finally {
			isSaving = false;
		}
	}

	async function review(status: ChecklistStatus.COMPLETED | ChecklistStatus.REJECTED) {
		isSaving = true;
		try {
			await apiReviewChecklistItem(item.id, { status, review_note: notes || undefined });
			onupdate();
		} catch { /* handled by parent */ } finally {
			isSaving = false;
		}
	}

	const badge = $derived(statusBadge[item.status] ?? { label: item.status, variant: 'outline' as const });
</script>

<Card>
	<CardContent class="flex flex-col gap-2 p-4">
		<div class="flex items-center justify-between">
			<span class="text-sm font-medium">{item.name}</span>
			<Badge variant={badge.variant}>{badge.label}</Badge>
		</div>
		{#if item.description}
			<p class="text-xs text-muted-foreground">{item.description}</p>
		{/if}

		{#if canEdit && (item.status === ChecklistStatus.PENDING || item.status === ChecklistStatus.REJECTED)}
			<div class="flex flex-col gap-2">
				<Input placeholder="Значение" bind:value={result} class="h-8 text-sm" />
				<Input placeholder="Заметки" bind:value={notes} class="h-8 text-sm" />
				<Button size="sm" onclick={save} disabled={isSaving}>
					{isSaving ? 'Сохранение...' : 'Сохранить'}
				</Button>
			</div>
		{:else if item.result}
			<p class="text-sm">Значение: {item.result}</p>
		{/if}

		{#if canReview && item.status === ChecklistStatus.COMPLETED}
			<div class="flex gap-2">
				<Button size="sm" onclick={() => review(ChecklistStatus.COMPLETED)} disabled={isSaving}>
					Одобрить
				</Button>
				<Button size="sm" variant="destructive" onclick={() => review(ChecklistStatus.REJECTED)} disabled={isSaving}>
					Отклонить
				</Button>
			</div>
		{/if}
	</CardContent>
</Card>
