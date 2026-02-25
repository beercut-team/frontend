<script lang="ts">
	import { Badge } from '@/shared/ui/badge';
	import { PatientStatus } from '@/shared/api/types';

	let { status }: { status: PatientStatus } = $props();

	const statusConfig: Record<PatientStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
		[PatientStatus.NEW]: { label: 'Новый', variant: 'secondary' },
		[PatientStatus.PREPARATION]: { label: 'Подготовка', variant: 'outline' },
		[PatientStatus.REVIEW_NEEDED]: { label: 'Требует проверки', variant: 'outline' },
		[PatientStatus.APPROVED]: { label: 'Одобрен', variant: 'default' },
		[PatientStatus.SURGERY_SCHEDULED]: { label: 'Операция назначена', variant: 'default' },
		[PatientStatus.COMPLETED]: { label: 'Завершено', variant: 'default' },
		[PatientStatus.REJECTED]: { label: 'Отклонён', variant: 'destructive' },
	};

	const config = $derived(statusConfig[status] ?? { label: status, variant: 'outline' as const });
</script>

<Badge variant={config.variant}>{config.label}</Badge>
