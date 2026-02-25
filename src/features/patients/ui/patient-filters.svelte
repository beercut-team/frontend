<script lang="ts">
	import { Input } from '@/shared/ui/input';
	import * as Select from '@/shared/ui/select';
	import { PatientStatus } from '@/shared/api/types';

	let {
		search = '',
		status = '',
		onsearch,
		onstatus,
	}: {
		search?: string;
		status?: string;
		onsearch: (val: string) => void;
		onstatus: (val: string) => void;
	} = $props();

	const statusOptions = [
		{ value: '', label: 'Все статусы' },
		{ value: PatientStatus.NEW, label: 'Новый' },
		{ value: PatientStatus.PREPARATION, label: 'Подготовка' },
		{ value: PatientStatus.REVIEW_NEEDED, label: 'Требует проверки' },
		{ value: PatientStatus.APPROVED, label: 'Одобрен' },
		{ value: PatientStatus.SURGERY_SCHEDULED, label: 'Операция назначена' },
		{ value: PatientStatus.COMPLETED, label: 'Завершено' },
		{ value: PatientStatus.REJECTED, label: 'Отклонён' },
	];

	let searchTimeout: ReturnType<typeof setTimeout>;

	function handleSearchInput(e: Event) {
		const val = (e.target as HTMLInputElement).value;
		clearTimeout(searchTimeout);
		searchTimeout = setTimeout(() => onsearch(val), 300);
	}
</script>

<div class="flex flex-col gap-3 sm:flex-row">
	<Input
		placeholder="Поиск пациентов..."
		value={search}
		oninput={handleSearchInput}
		class="sm:max-w-xs"
	/>
	<Select.Root type="single" value={status} onValueChange={(v) => onstatus(v)}>
		<Select.Trigger class="sm:w-56">
			{statusOptions.find((o) => o.value === status)?.label ?? 'Все статусы'}
		</Select.Trigger>
		<Select.Content>
			{#each statusOptions as opt}
				<Select.Item value={opt.value}>{opt.label}</Select.Item>
			{/each}
		</Select.Content>
	</Select.Root>
</div>
