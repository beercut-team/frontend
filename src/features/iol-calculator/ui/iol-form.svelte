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
		keratometry_k1: z.number().min(30).max(60),
		keratometry_k2: z.number().min(30).max(60),
		anterior_chamber_depth: z.number().min(1).max(6),
		lens_thickness: z.number().optional(),
		white_to_white: z.number().optional(),
		formula: z.string().min(1, 'Выберите формулу'),
		target_refraction: z.number().optional(),
	});

	const form = superForm(
		{
			eye: '',
			axial_length: 23.5,
			keratometry_k1: 43.0,
			keratometry_k2: 44.0,
			anterior_chamber_depth: 3.0,
			lens_thickness: undefined as number | undefined,
			white_to_white: undefined as number | undefined,
			formula: 'SRK/T',
			target_refraction: 0,
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
						const { data } = await apiCalculateIOL({
							patient_id: patientId,
							eye: f.data.eye as Eye,
							axial_length: f.data.axial_length,
							keratometry_k1: f.data.keratometry_k1,
							keratometry_k2: f.data.keratometry_k2,
							anterior_chamber_depth: f.data.anterior_chamber_depth,
							lens_thickness: f.data.lens_thickness,
							white_to_white: f.data.white_to_white,
							formula: f.data.formula,
							target_refraction: f.data.target_refraction,
						});
						oncalculated(data.data);
					} catch (e: any) {
						error = e.response?.data?.detail ?? 'Ошибка расчёта';
					} finally {
						isSubmitting = false;
					}
				}
			},
		}
	);

	const { form: formData, enhance } = form;

	const formulas = ['SRK/T', 'Holladay 1', 'Hoffer Q', 'Haigis', 'Barrett Universal II'];
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
							<Select.Trigger>
								{$formData.eye === 'LEFT' ? 'Левый (OS)' : $formData.eye === 'RIGHT' ? 'Правый (OD)' : 'Выберите глаз'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value="RIGHT">Правый (OD)</Select.Item>
								<Select.Item value="LEFT">Левый (OS)</Select.Item>
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
							<Select.Trigger>{$formData.formula || 'Выберите формулу'}</Select.Trigger>
							<Select.Content>
								{#each formulas as f}
									<Select.Item value={f}>{f}</Select.Item>
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

		<Form.Field {form} name="keratometry_k1">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Кератометрия K1 (D)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.keratometry_k1} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="keratometry_k2">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Кератометрия K2 (D)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.keratometry_k2} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="anterior_chamber_depth">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Глубина передней камеры (мм)</Form.Label>
						<Input {...props} {...constraints} type="number" step="0.01" bind:value={$formData.anterior_chamber_depth} />
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
	</div>

	<Button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Расчёт...' : 'Рассчитать ИОЛ'}
	</Button>
</form>
