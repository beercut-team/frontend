<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';
	import * as Form from '@/shared/ui/form';
	import { Input } from '@/shared/ui/input';
	import {
		Card,
		CardContent,
		CardDescription,
		CardFooter,
		CardHeader,
		CardTitle,
	} from '@/shared/ui/card';
	import { Separator } from '@/shared/ui/separator';

	const registerSchema = z
		.object({
			name: z.string().min(2, 'Имя слишком короткое'),
			email: z.string().email('Введите корректный email'),
			password: z.string().min(8, 'Минимум 8 символов'),
			passwordConfirm: z.string().min(1, 'Подтвердите пароль'),
		})
		.refine((data) => data.password === data.passwordConfirm, {
			message: 'Пароли не совпадают',
			path: ['passwordConfirm'],
		});

	type RegisterData = z.infer<typeof registerSchema>;

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const form = superForm(
		{ name: '', email: '', password: '', passwordConfirm: '' } satisfies RegisterData,
		{
			SPA: true,
			// sveltekit-superforms ZodObjectType doesn't accept ZodEffects — cast required
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			validators: zodClient(registerSchema as any),
			onUpdate({ form }) {
				if (form.valid) {
					const { passwordConfirm: _, ...data } = form.data;
					console.log('Register data:', data);
				}
			},
		}
	);

	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-6 text-center">
			<a href="/" class="text-2xl font-bold tracking-tight">Beercut</a>
			<p class="mt-1 text-sm text-muted-foreground">Создайте аккаунт</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Регистрация</CardTitle>
				<CardDescription>Заполните данные для создания аккаунта</CardDescription>
			</CardHeader>

			<CardContent>
				<form use:enhance class="flex flex-col gap-4">
					<Form.Field {form} name="name">
						{#snippet children({ constraints }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props }: ControlSnippetProps)}
									<Form.Label>Имя</Form.Label>
									<Input
										{...props}
										{...constraints}
										type="text"
										placeholder="Иван Иванов"
										bind:value={$formData.name}
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
									<Input
										{...props}
										{...constraints}
										type="email"
										placeholder="name@example.com"
										bind:value={$formData.email}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<Form.Field {form} name="password">
						{#snippet children({ constraints }: FieldSnippetProps)}
							<Form.Control>
								{#snippet children({ props }: ControlSnippetProps)}
									<Form.Label>Пароль</Form.Label>
									<Input
										{...props}
										{...constraints}
										type="password"
										placeholder="••••••••"
										bind:value={$formData.password}
									/>
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
									<Input
										{...props}
										{...constraints}
										type="password"
										placeholder="••••••••"
										bind:value={$formData.passwordConfirm}
									/>
								{/snippet}
							</Form.Control>
							<Form.FieldErrors />
						{/snippet}
					</Form.Field>

					<Form.Button class="mt-2 w-full">Создать аккаунт</Form.Button>
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
