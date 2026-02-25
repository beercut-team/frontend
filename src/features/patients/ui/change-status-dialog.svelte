<script lang="ts">
	import * as Dialog from '@/shared/ui/dialog';
	import { Button } from '@/shared/ui/button';
	import { Textarea } from '@/shared/ui/textarea';
	import * as Select from '@/shared/ui/select';
	import { Label } from '@/shared/ui/label';
	import { PatientStatus } from '@/shared/api/types';
	import { apiChangePatientStatus } from '@/shared/api';

	let {
		patientId,
		currentStatus,
		open = false,
		onclose,
		onstatusChanged,
	}: {
		patientId: number;
		currentStatus: PatientStatus;
		open?: boolean;
		onclose: () => void;
		onstatusChanged: () => void;
	} = $props();

	let newStatus = $state('');
	let comment = $state('');
	let isSubmitting = $state(false);
	let error = $state('');

	const statusOptions = [
		{ value: PatientStatus.NEW, label: 'Новый' },
		{ value: PatientStatus.PREPARATION, label: 'Подготовка' },
		{ value: PatientStatus.REVIEW_NEEDED, label: 'Требует проверки' },
		{ value: PatientStatus.APPROVED, label: 'Одобрен' },
		{ value: PatientStatus.SURGERY_SCHEDULED, label: 'Операция назначена' },
		{ value: PatientStatus.COMPLETED, label: 'Завершено' },
		{ value: PatientStatus.REJECTED, label: 'Отклонён' },
	].filter((o) => o.value !== currentStatus);

	async function handleSubmit() {
		if (!newStatus) return;
		isSubmitting = true;
		error = '';
		try {
			await apiChangePatientStatus(patientId, {
				status: newStatus as PatientStatus,
				comment: comment || undefined,
			});
			onstatusChanged();
			onclose();
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Ошибка смены статуса';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<Dialog.Root bind:open onOpenChange={(v) => !v && onclose()}>
	<Dialog.Content>
		<Dialog.Header>
			<Dialog.Title>Изменить статус пациента</Dialog.Title>
			<Dialog.Description>Выберите новый статус и добавьте комментарий</Dialog.Description>
		</Dialog.Header>

		<div class="flex flex-col gap-4 py-4">
			{#if error}
				<p class="text-sm text-destructive">{error}</p>
			{/if}

			<div class="flex flex-col gap-2">
				<Label>Новый статус</Label>
				<Select.Root type="single" onValueChange={(v) => (newStatus = v)}>
					<Select.Trigger>
						{statusOptions.find((o) => o.value === newStatus)?.label ?? 'Выберите статус'}
					</Select.Trigger>
					<Select.Content>
						{#each statusOptions as opt}
							<Select.Item value={opt.value}>{opt.label}</Select.Item>
						{/each}
					</Select.Content>
				</Select.Root>
			</div>

			<div class="flex flex-col gap-2">
				<Label>Комментарий</Label>
				<Textarea bind:value={comment} placeholder="Опционально" />
			</div>
		</div>

		<Dialog.Footer>
			<Button variant="outline" onclick={onclose}>Отмена</Button>
			<Button onclick={handleSubmit} disabled={!newStatus || isSubmitting}>
				{isSubmitting ? 'Сохранение...' : 'Изменить'}
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
