<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import { Textarea } from '@/shared/ui/textarea';
	import { Button } from '@/shared/ui/button';
	import type { District } from '@/shared/api';

	let {
		district,
		onsubmit,
		isSubmitting = false,
	}: {
		district?: District;
		onsubmit: (data: { name: string; region: string }) => Promise<void>;
		isSubmitting?: boolean;
	} = $props();

	let error = $state('');

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const schema = z.object({
		name: z.string().min(1, 'Обязательное поле'),
		region: z.string().min(1, 'Обязательное поле'),
	});

	const form = superForm(
		{
			name: district?.name ?? '',
			region: district?.region ?? '',
		},
		{
			SPA: true,
			resetForm: false,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validators: zodClient(schema as any),
			async onUpdate({ form: f }) {
				if (f.valid) {
					error = '';
					try {
						await onsubmit({
							name: f.data.name,
							region: f.data.region,
						});
					} catch (e: any) {
						error = e.response?.data?.detail ?? 'Ошибка сохранения';
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

	<Form.Field {form} name="name">
		{#snippet children({ constraints }: FieldSnippetProps)}
			<Form.Control>
				{#snippet children({ props }: ControlSnippetProps)}
					<Form.Label>Название</Form.Label>
					<Input {...props} {...constraints} bind:value={$formData.name} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		{/snippet}
	</Form.Field>

	<Form.Field {form} name="region">
		{#snippet children({ constraints }: FieldSnippetProps)}
			<Form.Control>
				{#snippet children({ props }: ControlSnippetProps)}
					<Form.Label>Регион</Form.Label>
					<Input {...props} {...constraints} bind:value={$formData.region} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		{/snippet}
	</Form.Field>

	<Button type="submit" disabled={isSubmitting}>
		{isSubmitting ? 'Сохранение...' : district ? 'Обновить' : 'Создать район'}
	</Button>
</form>
