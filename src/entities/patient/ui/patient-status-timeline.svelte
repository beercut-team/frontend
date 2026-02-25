<script lang="ts">
	import type { PatientStatusHistory } from '@/shared/api';
	import { PatientStatus } from '@/shared/api/types';

	let { history }: { history: PatientStatusHistory[] } = $props();

	const statusLabels: Record<string, string> = {
		[PatientStatus.NEW]: 'Новый',
		[PatientStatus.PREPARATION]: 'Подготовка',
		[PatientStatus.REVIEW_NEEDED]: 'Требует проверки',
		[PatientStatus.APPROVED]: 'Одобрен',
		[PatientStatus.SURGERY_SCHEDULED]: 'Операция назначена',
		[PatientStatus.COMPLETED]: 'Завершено',
		[PatientStatus.REJECTED]: 'Отклонён',
	};
</script>

<div class="relative space-y-4 pl-6">
	<div class="absolute left-2 top-2 bottom-2 w-0.5 bg-border"></div>
	{#each history as entry, i}
		<div class="relative">
			<div
				class="absolute -left-6 top-1 h-4 w-4 rounded-full border-2 {i === 0
					? 'border-primary bg-primary'
					: 'border-muted-foreground bg-background'}"
			></div>
			<div class="flex flex-col gap-0.5">
				<span class="text-sm font-medium">{statusLabels[entry.status] ?? entry.status}</span>
				<span class="text-xs text-muted-foreground">
					{new Date(entry.changed_at).toLocaleString('ru-RU')}
					{#if entry.changed_by}
						— {entry.changed_by}
					{/if}
				</span>
				{#if entry.comment}
					<span class="text-xs text-muted-foreground italic">{entry.comment}</span>
				{/if}
			</div>
		</div>
	{/each}
</div>
