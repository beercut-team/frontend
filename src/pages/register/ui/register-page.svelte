<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import * as Select from '@/shared/ui/select';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from '@/shared/ui/card';
	import { Separator } from '@/shared/ui/separator';
	import { performRegister } from '@/features/auth';
	import { UserRole } from '@/shared/api/types';
	import { applyPhoneMask } from '@/shared/utils/phone-mask';
	import { extractApiError } from '@/shared/utils/extract-error';
	import { roleLabels } from '@/shared/utils/role-labels';
	import { districtStore } from '@/entities/district';
	import { onMount } from 'svelte';

	let apiError = $state('');

	const registerSchema = z
		.object({
			name: z.string().min(2, 'Имя слишком короткое'),
			email: z.string().email('Введите корректный email'),
			password: z.string().min(6, 'Минимум 6 символов'),
			passwordConfirm: z.string().min(1, 'Подтвердите пароль'),
			role: z.string().min(1, 'Выберите роль'),
			first_name: z.string().min(1, 'Введите имя'),
			last_name: z.string().min(1, 'Введите фамилию'),
			middle_name: z.string().optional(),
			phone: z.string().optional(),
			district_id: z.number({ required_error: 'Выберите район' }).min(1, 'Выберите район'),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Пароли не совпадают',
			path: ['passwordConfirm'],
		});

	type RegisterData = z.infer<typeof registerSchema>;
	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const form = superForm(
		{
			name: '',
			email: '',
			password: '',
			passwordConfirm: '',
			role: '',
			first_name: '',
			last_name: '',
			middle_name: '',
			phone: '',
			district_id: 0,
		} satisfies RegisterData,
		{
			SPA: true,
			resetForm: false,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validators: zodClient(registerSchema as any),
			async onUpdate({ form }) {
				if (form.valid) {
					apiError = '';
					const { passwordConfirm: _, ...data } = form.data;
					try {
						await performRegister({
							...data,
							middle_name: data.middle_name || undefined,
							phone: data.phone || undefined,
						});
					} catch (e) {
						apiError = extractApiError(e, 'Ошибка регистрации. Попробуйте снова.');
					}
				}
			},
		}
	);

	const { form: formData, enhance } = form;

	const roleOptions = [
		{ value: UserRole.DISTRICT_DOCTOR, label: roleLabels[UserRole.DISTRICT_DOCTOR] },
		{ value: UserRole.SURGEON, label: roleLabels[UserRole.SURGEON] },
		{ value: UserRole.PATIENT, label: roleLabels[UserRole.PATIENT] },
	];

	function handlePhoneInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const cursorPos = input.selectionStart ?? 0;
		const prevLen = input.value.length;
		$formData.phone = applyPhoneMask(input.value);
		// Adjust cursor after mask is applied
		const diff = $formData.phone.length - prevLen;
		requestAnimationFrame(() => {
			input.setSelectionRange(cursorPos + diff, cursorPos + diff);
		});
	}

	onMount(() => {
		if (districtStore.districts.length === 0) {
			districtStore.fetchDistricts();
		}
	});
</script>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<div class="mb-6 text-center">
			<a href="/" class="text-2xl font-bold tracking-tight">Oculus-Feldsher</a>
			<p class="mt-1 text-sm text-muted-foreground">Создайте аккаунт</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Регистрация</CardTitle>
				<CardDescription>Заполните данные для создания аккаунта</CardDescription>
			</CardHeader>

			<CardContent>
				<form use:enhance class="flex flex-col gap-4">
					<Form.Field {form} name="role">
						{#snippet children({ constraints: _ }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props: _ }: ControlSnippetProps)}
									<Form.Label>Роль</Form.Label>
									<Select.Root type="single" onValueChange={(v) => ($formData.role = v)}>
										<Select.Trigger class="w-full">
											{roleOptions.find((o) => o.value === $formData.role)?.label ?? 'Выберите роль'}
										</Select.Trigger>
										<Select.Content>
											{#each roleOptions as opt}
												<Select.Item value={opt.value}>{opt.label}</Select.Item>
											{/each}
										</Select.Content>
									</Select.Root>
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
									<Select.Root type="single" onValueChange={(v) => ($formData.district_id = parseInt(v, 10))}>
										<Select.Trigger class="w-full">
											{districtStore.districts.find((d) => d.id === $formData.district_id)?.name ?? 'Выберите район'}
										</Select.Trigger>
										<Select.Content>
											{#if districtStore.isLoading}
												<Select.Item value="0" disabled>Загрузка...</Select.Item>
											{:else if districtStore.districts.length === 0}
												<Select.Item value="0" disabled>Нет доступных районов</Select.Item>
											{:else}
												{#each districtStore.districts as district}
													<Select.Item value={district.id.toString()}>{district.name}</Select.Item>
												{/each}
											{/if}
										</Select.Content>
									</Select.Root>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<div class="grid grid-cols-2 gap-4">
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
					</div>

					<Form.Field {form} name="middle_name">
						{#snippet children({ constraints }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props }: ControlSnippetProps)}
									<Form.Label>Отчество</Form.Label>
									<Input {...props} {...constraints} bind:value={$formData.middle_name} placeholder="Необязательно" />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<Form.Field {form} name="name">
						{#snippet children({ constraints }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props }: ControlSnippetProps)}
									<Form.Label>Имя пользователя</Form.Label>
									<Input {...props} {...constraints} bind:value={$formData.name} placeholder="Логин" />
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
									<Input {...props} {...constraints} type="email" placeholder="name@example.com" bind:value={$formData.email} />
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
										oninput={handlePhoneInput}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<Separator />

					<Form.Field {form} name="password">
						{#snippet children({ constraints }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props }: ControlSnippetProps)}
									<Form.Label>Пароль</Form.Label>
									<Input {...props} {...constraints} type="password" placeholder="••••••••" bind:value={$formData.password} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<Form.Field {form} name="passwordConfirm">
						{#snippet children({ constraints }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props }: ControlSnippetProps)}
									<Form.Label>Подтвердите пароль</Form.Label>
									<Input {...props} {...constraints} type="password" placeholder="••••••••" bind:value={$formData.passwordConfirm} />
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<Form.Button class="mt-2 w-full">Создать аккаунт</Form.Button>

					{#if apiError}
						<div class="rounded-md border border-destructive/50 bg-destructive/10 p-3">
							<p class="text-sm font-medium text-destructive">Ошибка регистрации</p>
							<pre class="mt-1 whitespace-pre-wrap text-xs text-destructive/80">{apiError}</pre>
						</div>
					{/if}
				</form>
			</CardContent>

			<CardFooter class="flex flex-col gap-4">
				<Separator />
				<p class="text-center text-sm text-muted-foreground">
					Уже есть аккаунт?
					<a href="/login" class="font-medium text-foreground underline-offset-4 hover:underline">
						Войти
					</a>
				</p>
			</CardFooter>
		</Card>
	</div>
</div>
