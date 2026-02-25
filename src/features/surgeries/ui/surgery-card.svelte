<script lang="ts">
	import type { Surgery } from '@/shared/api';
	import { SurgeryStatus, OperationType, Eye } from '@/shared/api/types';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import { Badge } from '@/shared/ui/badge';

	let { surgery, onclick }: { surgery: Surgery; onclick?: () => void } = $props();

	const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
		[SurgeryStatus.SCHEDULED]: { label: 'Запланирована', variant: 'outline' },
		[SurgeryStatus.COMPLETED]: { label: 'Завершена', variant: 'secondary' },
		[SurgeryStatus.CANCELLED]: { label: 'Отменена', variant: 'destructive' },
	};

	const operationLabels: Record<string, string> = {
		[OperationType.PHACOEMULSIFICATION]: 'Факоэмульсификация',
		[OperationType.ANTIGLAUCOMA]: 'Антиглаукомная',
		[OperationType.VITRECTOMY]: 'Витрэктомия',
	};

	const badge = $derived(statusLabels[surgery.status] ?? { label: surgery.status, variant: 'outline' as const });
</script>

<Card class="cursor-pointer transition-shadow hover:shadow-md" onclick={onclick}>
	<CardHeader class="pb-2">
		<div class="flex items-start justify-between">
			<CardTitle class="text-base">{operationLabels[surgery.operation_type] ?? surgery.operation_type}</CardTitle>
			<Badge variant={badge.variant}>{badge.label}</Badge>
		</div>
	</CardHeader>
	<CardContent>
		<div class="flex flex-col gap-1 text-sm text-muted-foreground">
			<span>Дата: {new Date(surgery.scheduled_date).toLocaleString('ru-RU')}</span>
			<span>Глаз: {surgery.eye === Eye.OS ? 'Левый (OS)' : surgery.eye === Eye.OD ? 'Правый (OD)' : 'Оба (OU)'}</span>
			{#if surgery.patient}
				<span>Пациент: {surgery.patient.last_name} {surgery.patient.first_name}</span>
			{/if}
		</div>
	</CardContent>
</Card>
