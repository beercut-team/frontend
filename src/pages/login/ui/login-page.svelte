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
	import { performLogin } from '@/features/auth';
	import { extractApiError } from '@/shared/utils/extract-error';

	let apiError = $state('');

	const loginSchema = z.object({
		email: z.string().email('Введите корректный email'),
		password: z.string().min(1, 'Введите пароль'),
	});

	type LoginData = z.infer<typeof loginSchema>;

	type FieldSnippetProps = { constraints: Record<string, unknown> };
	type ControlSnippetProps = { props: Record<string, unknown> };

	const form = superForm({ email: '', password: '' } satisfies LoginData, {
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

	const { form: formData, enhance } = form;
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

					<Form.Button class="mt-2 w-full">Войти</Form.Button>

					{#if apiError}
						<div class="rounded-md border border-destructive/50 bg-destructive/10 p-3">
							<p class="text-sm font-medium text-destructive">Ошибка входа</p>
							<pre class="mt-1 whitespace-pre-wrap text-xs text-destructive/80">{apiError}</pre>
						</div>
					{/if}
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
