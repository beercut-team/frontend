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
		scheduled_date: z.string().min(1, 'Укажите дату'),
		notes: z.string().optional(),
	});

	const form = superForm(
		{
			scheduled_date: '',
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
							scheduled_date: f.data.scheduled_date,
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
</script>

<form use:enhance class="flex flex-col gap-4">
	{#if error}
		<p class="text-sm text-destructive">{error}</p>
	{/if}

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
