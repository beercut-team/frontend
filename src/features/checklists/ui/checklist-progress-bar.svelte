<script lang="ts">
	import type { ChecklistProgress } from '@/shared/api';
	import { Progress } from '@/shared/ui/progress';

	let { progress }: { progress: ChecklistProgress } = $props();
</script>

<div class="flex flex-col gap-2">
	<div class="flex items-center justify-between text-sm">
		<span class="text-muted-foreground">Прогресс чек-листа</span>
		<span class="font-medium">{progress.percentage}%</span>
	</div>
	<Progress value={progress.percentage} />
	<div class="flex gap-4 text-xs text-muted-foreground">
		<span>Всего: {progress.total}</span>
		<span>Заполнено: {progress.completed}</span>
		<span>Одобрено: {progress.reviewed}</span>
		{#if progress.rejected > 0}
			<span class="text-destructive">Отклонено: {progress.rejected}</span>
		{/if}
	</div>
</div>
