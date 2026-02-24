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

	const loginSchema = z.object({
		email: z.string().email('Введите корректный email'),
		password: z.string().min(1, 'Введите пароль'),
	});

	type LoginData = z.infer<typeof loginSchema>;

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const form = superForm({ email: '', password: '' } satisfies LoginData, {
		SPA: true,
		// sveltekit-superforms ZodObjectType doesn't match inferred zod type — cast required
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		validators: zodClient(loginSchema as any),
		onUpdate({ form }) {
			if (form.valid) {
				console.log('Login data:', form.data);
			}
		},
	});

	const { form: formData, enhance } = form;
</script>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-sm">
		<div class="mb-6 text-center">
			<a href="/" class="text-2xl font-bold tracking-tight">Beercut</a>
			<p class="mt-1 text-sm text-muted-foreground">Войдите в свой аккаунт</p>
		</div>

		<Card>
			<CardHeader>
				<CardTitle>Вход</CardTitle>
				<CardDescription>Введите email и пароль для входа</CardDescription>
			</CardHeader>

			<CardContent>
				<form use:enhance class="flex flex-col gap-4">
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
									<div class="flex items-center justify-between">
										<Form.Label>Пароль</Form.Label>
										<a
											href="/forgot-password"
											class="text-xs text-muted-foreground hover:text-foreground"
										>
											Забыли пароль?
										</a>
									</div>
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

					<Form.Button class="mt-2 w-full">Войти</Form.Button>
				</form>
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
