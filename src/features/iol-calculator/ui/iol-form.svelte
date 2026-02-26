<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import * as Select from '@/shared/ui/select';
	import { Button } from '@/shared/ui/button';
	import { apiCalculateIOL } from '@/shared/api';
	import type { IOLCalculation } from '@/shared/api';
	import { Eye } from '@/shared/api/types';

	let {
		patientId,
		oncalculated,
	}: {
		patientId: number;
		oncalculated: (result: IOLCalculation) => void;
	} = $props();

	let error = $state('');
	let isSubmitting = $state(false);

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const schema = z.object({
		eye: z.string().min(1, 'Выберите глаз'),
		axial_length: z.number().min(15).max(40),
		keratometry1: z.number().min(30).max(60),
		keratometry2: z.number().min(30).max(60),
		acd: z.number().min(1).max(6).optional(),
		formula: z.string().min(1, 'Выберите формулу'),
		target_refraction: z.number().optional(),
		a_constant: z.number().optional(),
	});

	const form = superForm(
		{
			eye: '',
			axial_length: 23.5,
			keratometry1: 43.0,
			keratometry2: 44.0,
			acd: 3.0,
			formula: 'SRKT',
			target_refraction: 0,
			a_constant: 118.4,
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
						console.log('[IOL Calculator] Отправка данных:', {
							patient_id: patientId,
							eye: f.data.eye,
							axial_length: f.data.axial_length,
							keratometry1: f.data.keratometry1,
							keratometry2: f.data.keratometry2,
							acd: f.data.acd,
							formula: f.data.formula,
							target_refraction: f.data.target_refraction,
							a_constant: f.data.a_constant,
						});

						const { data } = await apiCalculateIOL({
							patient_id: patientId,
							eye: f.data.eye as Eye,
							axial_length: f.data.axial_length,
							keratometry1: f.data.keratometry1,
							keratometry2: f.data.keratometry2,
							acd: f.data.acd,
							formula: f.data.formula,
							target_refraction: f.data.target_refraction,
							a_constant: f.data.a_constant,
						});

						console.log('[IOL Calculator] Успешный расчёт:', data.data);
						oncalculated(data.data);
					} catch (e: any) {
						console.error('[IOL Calculator] Ошибка расчёта:', e);
						console.error('[IOL Calculator] Ответ сервера:', e.response?.data);
						console.error('[IOL Calculator] Статус:', e.response?.status);

						const errorDetail = e.response?.data?.error || e.response?.data?.detail || e.message;
						error = errorDetail || 'Ошибка расчёта';
					} finally {
						isSubmitting = false;
					}
				}
			},
		}
	);

	const { form: formData, enhance } = form;

	const formulas = [
		{ value: 'SRKT', label: 'SRK/T' },
		{ value: 'HAIGIS', label: 'Haigis' },
		{ value: 'HOFFERQ', label: 'Hoffer Q' },
	];
</script>

<form use:enhance class="flex flex-col gap-4">
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Form.Field {form} name="eye">
			{#snippet children({ constraints: _ }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props: _ }: ControlSnippetProps)}
						<Form.Label>Глаз</Form.Label>
						<Select.Root type="single" onValueChange={(v) => ($formData.eye = v)}>
							<Select.Trigger class="w-full">
								{$formData.eye === Eye.OS ? 'Левый (OS)' : $formData.eye === Eye.OD ? 'Правый (OD)' : 'Выберите глаз'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={Eye.OD}>Правый (OD)</Select.Item>
								<Select.Item value={Eye.OS}>Левый (OS)</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="formula">
			{#snippet children({ constraints: _ }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props: _ }: ControlSnippetProps)}
						<Form.Label>Формула</Form.Label>
						<Select.Root type="single" value={$formData.formula} onValueChange={(v) => ($formData.formula = v)}>
							<Select.Trigger class="w-full">
								{formulas.find((f) => f.value === $formData.formula)?.label || 'Выберите формулу'}
							</Select.Trigger>
							<Select.Content>
								{#each formulas as f}
									<Select.Item value={f.value}>{f.label}</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="axial_length">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Аксиальная длина (мм)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.axial_length} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="keratometry1">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Кератометрия K1 (D)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.keratometry1} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="keratometry2">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Кератометрия K2 (D)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.keratometry2} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="acd">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Глубина передней камеры (мм)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.acd} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="target_refraction">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Целевая рефракция (D)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.25" bind:value={$formData.target_refraction} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="a_constant">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>A-константа</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.1" bind:value={$formData.a_constant} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>
	</div>

	<Button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Расчёт...' : 'Рассчитать ИОЛ'}
	</Button>
</form>
