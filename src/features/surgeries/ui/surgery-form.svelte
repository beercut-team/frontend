<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import { Textarea } from '@/shared/ui/textarea';
	import * as Select from '@/shared/ui/select';
	import { Button } from '@/shared/ui/button';
	import { OperationType, Eye } from '@/shared/api/types';
	import { apiCreateSurgery } from '@/shared/api';
	import type { Surgery } from '@/shared/api';

	let {
		patientId,
		oncreated,
	}: {
		patientId: number;
		oncreated: (surgery: Surgery) => void;
	} = $props();

	let error = $state('');
	let isSubmitting = $state(false);

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const schema = z.object({
		operation_type: z.string().min(1, 'Выберите тип операции'),
		eye: z.string().min(1, 'Выберите глаз'),
		scheduled_date: z.string().min(1, 'Укажите дату'),
		iol_power: z.number().optional(),
		notes: z.string().optional(),
	});

	const form = superForm(
		{
			operation_type: '',
			eye: '',
			scheduled_date: '',
			iol_power: undefined as number | undefined,
			notes: '',
		},
		{
			SPA: true,
			resetForm: false,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validators: zodClient(schema as any),
			async onUpdate({ form: f }) {
				if (f.valid) {
					error = '';
					isSubmitting = true;
					try {
						const { data } = await apiCreateSurgery({
							patient_id: patientId,
							operation_type: f.data.operation_type as OperationType,
							eye: f.data.eye as Eye,
							scheduled_date: f.data.scheduled_date,
							iol_power: f.data.iol_power,
							notes: f.data.notes || undefined,
						});
						oncreated(data.data);
					} catch (e: any) {
						error = e.response?.data?.detail ?? 'Ошибка создания операции';
					} finally {
						isSubmitting = false;
					}
				}
			},
		}
	);

	const { form: formData, enhance } = form;

	const operationTypes = [
		{ value: OperationType.PHACOEMULSIFICATION, label: 'Факоэмульсификация' },
		{ value: OperationType.ANTIGLAUCOMA, label: 'Антиглаукомная' },
		{ value: OperationType.VITRECTOMY, label: 'Витрэктомия' },
	];
</script>

<form use:enhance class="flex flex-col gap-4">
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Form.Field {form} name="operation_type">
			{#snippet children({ constraints: _ }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props: _ }: ControlSnippetProps)}
						<Form.Label>Тип операции</Form.Label>
						<Select.Root type="single" onValueChange={(v) => ($formData.operation_type = v)}>
							<Select.Trigger>
								{operationTypes.find((o) => o.value === $formData.operation_type)?.label ?? 'Выберите тип'}
							</Select.Trigger>
							<Select.Content>
								{#each operationTypes as opt}
									<Select.Item value={opt.value}>{opt.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="eye">
			{#snippet children({ constraints: _ }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props: _ }: ControlSnippetProps)}
						<Form.Label>Глаз</Form.Label>
						<Select.Root type="single" onValueChange={(v) => ($formData.eye = v)}>
							<Select.Trigger>
								{$formData.eye === 'LEFT' ? 'Левый (OS)' : $formData.eye === 'RIGHT' ? 'Правый (OD)' : $formData.eye === 'BOTH' ? 'Оба' : 'Выберите'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="RIGHT">Правый (OD)</Select.Item>
								<Select.Item value="LEFT">Левый (OS)</Select.Item>
								<Select.Item value="BOTH">Оба</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="scheduled_date">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Дата операции</Form.Label>
						<Input {...props} {...constraints} type="datetime-local" bind:value={$formData.scheduled_date} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="iol_power">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Сила ИОЛ (D)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.5" bind:value={$formData.iol_power} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>
	</div>

	<Form.Field {form} name="notes">
		{#snippet children({ constraints }: FieldSnippetProps)}
			<Form.Control>
				{#snippet children({ props }: ControlSnippetProps)}
					<Form.Label>Заметки</Form.Label>
					<Textarea {...props} {...constraints} bind:value={$formData.notes} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		{/snippet}
	</Form.Field>

	<Button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Создание...' : 'Назначить операцию'}
	</Button>
</form>
