<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import { Textarea } from '@/shared/ui/textarea';
	import * as Select from '@/shared/ui/select';
	import { Button } from '@/shared/ui/button';
	import type { Patient } from '@/shared/api';
	import { OperationType, Eye } from '@/shared/api/types';
	import { districtStore } from '@/entities/district';
	import { onMount } from 'svelte';
	import { applyPhoneMask } from '@/shared/utils/phone-mask';
	import { extractApiError } from '@/shared/utils/extract-error';

	let {
		patient,
		onsubmit,
		isSubmitting = false,
	}: {
		patient?: Patient;
		onsubmit: (data: any) => Promise<void>;
		isSubmitting?: boolean;
	} = $props();

	let apiError = $state('');

	const schema = z.object({
		first_name: z.string().min(1, 'Обязательное поле'),
		last_name: z.string().min(1, 'Обязательное поле'),
		middle_name: z.string().optional(),
		date_of_birth: z.string().optional(),
		phone: z.string().optional(),
		email: z.string().email('Некорректный email').optional().or(z.literal('')),
		address: z.string().optional(),
		snils: z.string().optional(),
		passport_series: z.string().optional(),
		passport_number: z.string().optional(),
		policy_number: z.string().optional(),
		district_id: z.number({ required_error: 'Выберите район' }),
		diagnosis: z.string().optional(),
		operation_type: z.string().min(1, 'Выберите тип операции'),
		eye: z.string().min(1, 'Выберите глаз'),
		notes: z.string().optional(),
	});

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const form = superForm(
		{
			first_name: patient?.first_name ?? '',
			last_name: patient?.last_name ?? '',
			middle_name: patient?.middle_name ?? '',
			date_of_birth: patient?.date_of_birth?.split('T')[0] ?? '',
			phone: patient?.phone ?? '',
			email: patient?.email ?? '',
			address: patient?.address ?? '',
			snils: patient?.snils ?? '',
			passport_series: patient?.passport_series ?? '',
			passport_number: patient?.passport_number ?? '',
			policy_number: patient?.policy_number ?? '',
			district_id: patient?.district_id ?? 0,
			diagnosis: patient?.diagnosis ?? '',
			operation_type: patient?.operation_type ?? '',
			eye: patient?.eye ?? '',
			notes: patient?.notes ?? '',
		},
		{
			SPA: true,
			resetForm: false,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validators: zodClient(schema as any),
			async onUpdate({ form: f }) {
				if (f.valid) {
					apiError = '';
					try {
						await onsubmit(f.data);
					} catch (e) {
						apiError = extractApiError(e, 'Ошибка сохранения');
					}
				}
			},
		}
	);

	const { form: formData, enhance } = form;

	onMount(() => {
		if (districtStore.districts.length === 0) {
			districtStore.fetchDistricts();
		}
	});
</script>

<form use:enhance class="flex flex-col gap-4">
	<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
		<Form.Field {form} name="last_name">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Фамилия</Form.Label>
						<Input {...props} {...constraints} bind:value={$formData.last_name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="first_name">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Имя</Form.Label>
						<Input {...props} {...constraints} bind:value={$formData.first_name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="middle_name">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Отчество</Form.Label>
						<Input {...props} {...constraints} bind:value={$formData.middle_name} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="date_of_birth">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Дата рождения</Form.Label>
						<Input {...props} {...constraints} type="date" bind:value={$formData.date_of_birth} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="operation_type">
			{#snippet children({ constraints: _ }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props: _ }: ControlSnippetProps)}
						<Form.Label>Тип операции</Form.Label>
						<Select.Root type="single" onValueChange={(v) => ($formData.operation_type = v)}>
							<Select.Trigger>
								{$formData.operation_type === OperationType.PHACOEMULSIFICATION ? 'Факоэмульсификация' :
								 $formData.operation_type === OperationType.ANTIGLAUCOMA ? 'Антиглаукомная' :
								 $formData.operation_type === OperationType.VITRECTOMY ? 'Витрэктомия' : 'Выберите тип'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={OperationType.PHACOEMULSIFICATION}>Факоэмульсификация</Select.Item>
								<Select.Item value={OperationType.ANTIGLAUCOMA}>Антиглаукомная</Select.Item>
								<Select.Item value={OperationType.VITRECTOMY}>Витрэктомия</Select.Item>
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
								{$formData.eye === Eye.OD ? 'OD (правый)' :
								 $formData.eye === Eye.OS ? 'OS (левый)' :
								 $formData.eye === Eye.OU ? 'OU (оба)' : 'Выберите глаз'}
							</Select.Trigger>
							<Select.Content>
								<Select.Item value={Eye.OD}>OD (правый)</Select.Item>
								<Select.Item value={Eye.OS}>OS (левый)</Select.Item>
								<Select.Item value={Eye.OU}>OU (оба)</Select.Item>
							</Select.Content>
						</Select.Root>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="phone">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Телефон</Form.Label>
						<Input
										{...props}
										{...constraints}
										type="tel"
										placeholder="+7 (___) ___-__-__"
										value={$formData.phone}
										oninput={(e: Event) => {
											const input = e.target as HTMLInputElement;
											$formData.phone = applyPhoneMask(input.value);
										}}
									/>
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="email">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Email</Form.Label>
						<Input {...props} {...constraints} type="email" bind:value={$formData.email} />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="district_id">
			{#snippet children({ constraints: _ }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props: _ }: ControlSnippetProps)}
						<Form.Label>Район</Form.Label>
						{#if districtStore.isLoading}
							<div class="flex h-9 items-center rounded-md border px-3 text-sm text-muted-foreground">
								Загрузка районов...
							</div>
						{:else if districtStore.error}
							<div class="text-xs text-destructive">{districtStore.error}</div>
						{:else}
							<Select.Root type="single" onValueChange={(v) => ($formData.district_id = Number(v))}>
								<Select.Trigger>
									{districtStore.districts.find((d) => d.id === $formData.district_id)?.name ?? 'Выберите район'}
								</Select.Trigger>
								<Select.Content>
									{#each districtStore.districts as district}
										<Select.Item value={String(district.id)}>{district.name}</Select.Item>
									{/each}
								</Select.Content>
							</Select.Root>
						{/if}
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>
	</div>

	<Form.Field {form} name="address">
		{#snippet children({ constraints }: FieldSnippetProps)}
			<Form.Control>
				{#snippet children({ props }: ControlSnippetProps)}
					<Form.Label>Адрес</Form.Label>
					<Input {...props} {...constraints} bind:value={$formData.address} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		{/snippet}
	</Form.Field>

	<div class="grid grid-cols-1 gap-4 sm:grid-cols-3">
		<Form.Field {form} name="snils">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>СНИЛС</Form.Label>
						<Input {...props} {...constraints} bind:value={$formData.snils} placeholder="123-456-789 00" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="passport_series">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Серия паспорта</Form.Label>
						<Input {...props} {...constraints} bind:value={$formData.passport_series} placeholder="1234" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>

		<Form.Field {form} name="passport_number">
			{#snippet children({ constraints }: FieldSnippetProps)}
				<Form.Control>
					{#snippet children({ props }: ControlSnippetProps)}
						<Form.Label>Номер паспорта</Form.Label>
						<Input {...props} {...constraints} bind:value={$formData.passport_number} placeholder="567890" />
					{/snippet}
				</Form.Control>
				<Form.FieldErrors />
			{/snippet}
		</Form.Field>
	</div>

	<Form.Field {form} name="policy_number">
		{#snippet children({ constraints }: FieldSnippetProps)}
			<Form.Control>
				{#snippet children({ props }: ControlSnippetProps)}
					<Form.Label>Номер полиса ОМС</Form.Label>
					<Input {...props} {...constraints} bind:value={$formData.policy_number} />
				{/snippet}
			</Form.Control>
			<Form.FieldErrors />
		{/snippet}
	</Form.Field>

	<Form.Field {form} name="diagnosis">
		{#snippet children({ constraints }: FieldSnippetProps)}
			<Form.Control>
				{#snippet children({ props }: ControlSnippetProps)}
					<Form.Label>Диагноз</Form.Label>
					<Textarea {...props} {...constraints} bind:value={$formData.diagnosis} />
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

	<Button type="submit" class="w-full" disabled={isSubmitting}>
		{isSubmitting ? 'Сохранение...' : patient ? 'Обновить' : 'Создать пациента'}
	</Button>

	{#if apiError}
		<div class="rounded-md border border-destructive/50 bg-destructive/10 p-3">
			<p class="text-sm font-medium text-destructive">Ошибка</p>
			<pre class="mt-1 whitespace-pre-wrap text-xs text-destructive/80">{apiError}</pre>
		</div>
	{/if}
</form>
