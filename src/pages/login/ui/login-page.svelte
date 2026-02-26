<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import * as Tabs from '@/shared/ui/tabs';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from '@/shared/ui/card';
	import { Separator } from '@/shared/ui/separator';
	import { performLogin, performPatientLogin } from '@/features/auth';
	import { extractApiError } from '@/shared/utils/extract-error';

	let apiError = $state('');
	let activeTab = $state('staff');

	const loginSchema = z.object({
		email: z.string().email('Введите корректный email'),
		password: z.string().min(1, 'Введите пароль'),
	});

	const patientLoginSchema = z.object({
		access_code: z.string().length(8, 'Код должен содержать 8 символов'),
	});

	type LoginData = z.infer<typeof loginSchema>;
	type PatientLoginData = z.infer<typeof patientLoginSchema>;
	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const staffForm = superForm({ email: '', password: '' } satisfies LoginData, {
		SPA: true,
		resetForm: false,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		validators: zodClient(loginSchema as any),
		async onUpdate({ form }) {
			if (form.valid) {
				apiError = '';
				try {
					await performLogin(form.data.email, form.data.password);
				} catch (e) {
					apiError = extractApiError(e, 'Ошибка входа. Попробуйте снова.');
				}
			}
		},
	});

	const patientForm = superForm({ access_code: '' } satisfies PatientLoginData, {
		SPA: true,
		resetForm: false,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		validators: zodClient(patientLoginSchema as any),
		async onUpdate({ form }) {
			if (form.valid) {
				apiError = '';
				try {
					await performPatientLogin(form.data.access_code);
				} catch (e) {
					apiError = extractApiError(e, 'Неверный код доступа.');
				}
			}
		},
	});

	const { form: staffFormData, enhance: staffEnhance } = staffForm;
	const { form: patientFormData, enhance: patientEnhance } = patientForm;
</script>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-6 text-center">
			<a href="/" class="text-2xl font-bold tracking-tight">Oculus-Feldsher</a>
			<p class="mt-1 text-sm text-muted-foreground">Войдите в свой аккаунт</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Вход</CardTitle>
				<CardDescription>Выберите способ входа</CardDescription>
			</CardHeader>

			<CardContent>
				<Tabs.Root bind:value={activeTab}>
					<Tabs.List class="grid w-full grid-cols-2">
						<Tabs.Trigger value="staff">Сотрудник</Tabs.Trigger>
						<Tabs.Trigger value="patient">Пациент</Tabs.Trigger>
					</Tabs.List>

					<Tabs.Content value="staff" class="mt-4">
						<form use:staffEnhance class="flex flex-col gap-4">
							<Form.Field form={staffForm} name="email">
								{#snippet children({ constraints }: FieldSnippetProps)}
									<Form.Control>
										{#snippet children({ props }: ControlSnippetProps)}
											<Form.Label>Email</Form.Label>
											<Input
												{...props}
												{...constraints}
												type="email"
												placeholder="name@example.com"
												bind:value={$staffFormData.email}
											/>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								{/snippet}
							</Form.Field>

							<Form.Field form={staffForm} name="password">
								{#snippet children({ constraints }: FieldSnippetProps)}
									<Form.Control>
										{#snippet children({ props }: ControlSnippetProps)}
											<Form.Label>Пароль</Form.Label>
											<Input
												{...props}
												{...constraints}
												type="password"
												placeholder="••••••••"
												bind:value={$staffFormData.password}
											/>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
								{/snippet}
							</Form.Field>

							<Form.Button class="mt-2 w-full">Войти</Form.Button>
						</form>
					</Tabs.Content>

					<Tabs.Content value="patient" class="mt-4">
						<form use:patientEnhance class="flex flex-col gap-4">
							<Form.Field form={patientForm} name="access_code">
								{#snippet children({ constraints }: FieldSnippetProps)}
									<Form.Control>
										{#snippet children({ props }: ControlSnippetProps)}
											<Form.Label>Код доступа</Form.Label>
											<Input
												{...props}
												{...constraints}
												type="text"
												placeholder="a1b2c3d4"
												maxlength={8}
												bind:value={$patientFormData.access_code}
											/>
										{/snippet}
									</Form.Control>
									<Form.FieldErrors />
									<p class="text-xs text-muted-foreground">
										Введите 8-значный код доступа, который вы получили от врача
									</p>
								{/snippet}
							</Form.Field>

							<Form.Button class="mt-2 w-full">Войти</Form.Button>
						</form>
					</Tabs.Content>
				</Tabs.Root>

				{#if apiError}
					<div class="mt-4 rounded-md border border-destructive/50 bg-destructive/10 p-3">
						<p class="text-sm font-medium text-destructive">Ошибка входа</p>
						<pre class="mt-1 whitespace-pre-wrap text-xs text-destructive/80">{apiError}</pre>
					</div>
				{/if}
			</CardContent>

			<CardFooter class="flex flex-col gap-4">
				<Separator />
				<p class="text-center text-sm text-muted-foreground">
					Нет аккаунта?
					<a href="/register" class="font-medium text-foreground underline-offset-4 hover:underline">
						Зарегистрироваться
					</a>
				</p>
			</CardFooter>
		</Card>
	</div>
</div>
