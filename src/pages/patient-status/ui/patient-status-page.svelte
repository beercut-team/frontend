<script lang="ts">
	import { apiGetPatientPublicStatus } from '@/shared/api';
	import type { PatientPublicResponse } from '@/shared/api';
	import { PatientStatusBadge, PatientStatusTimeline } from '@/entities/patient';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { onMount } from 'svelte';

	let { code }: { code: string } = $props();

	let data = $state<PatientPublicResponse | null>(null);
	let isLoading = $state(true);
	let error = $state('');

	onMount(async () => {
		console.log('[Patient Status] Загрузка статуса для кода:', code);
		console.log('[Patient Status] Тип кода:', typeof code);
		console.log('[Patient Status] Длина кода:', code?.length);

		try {
			const res = await apiGetPatientPublicStatus(code);
			console.log('[Patient Status] Успешный ответ:', res.data);
			data = res.data.data;
		} catch (e: any) {
			console.error('[Patient Status] Ошибка при загрузке:', e);
			console.error('[Patient Status] Ответ сервера:', e.response?.data);
			console.error('[Patient Status] Статус ответа:', e.response?.status);
			console.error('[Patient Status] URL запроса:', e.config?.url);

			const errorDetail = e.response?.data?.detail || e.response?.data?.error || e.message;
			error = errorDetail || 'Пациент не найден';

			// Добавляем код в сообщение об ошибке для отладки
			if (error.includes('код')) {
				error = `${error} (Код: ${code})`;
			}
		} finally {
			isLoading = false;
		}
	});
</script>

<svelte:head>
	<title>Статус пациента — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-lg px-6 py-12">
	<div class="mb-8 text-center">
		<h1 class="text-2xl font-bold">Oculus-Feldsher</h1>
		<p class="text-muted-foreground">Отслеживание статуса пациента</p>
	</div>

	{#if isLoading}
		<Skeleton class="h-64 rounded-lg" />
	{:else if data}
		<Card>
			<CardHeader>
				<CardTitle>{data.first_name} {data.last_name}</CardTitle>
				<CardDescription>
					Код доступа: {data.access_code}
				</CardDescription>
			</CardHeader>
			<CardContent class="flex flex-col gap-6">
				<div class="flex items-center gap-3">
					<span class="text-sm text-muted-foreground">Текущий статус:</span>
					<PatientStatusBadge status={data.status} />
				</div>

				{#if data.status_history.length > 0}
					<div>
						<h3 class="mb-3 text-sm font-semibold">История статусов</h3>
						<PatientStatusTimeline history={data.status_history} />
					</div>
				{/if}
			</CardContent>
		</Card>
	{:else}
		<Card>
			<CardContent class="py-8">
				<div class="space-y-4 text-center">
					<p class="text-destructive">{error}</p>
					<div class="rounded-md bg-muted p-4 text-left text-xs">
						<p class="mb-2 font-semibold">Информация для отладки:</p>
						<p>Код доступа: <code class="rounded bg-background px-1 py-0.5">{code}</code></p>
						<p>Длина кода: {code?.length || 0} символов</p>
						<p class="mt-2 text-muted-foreground">
							Проверьте консоль браузера (F12) для подробной информации об ошибке
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
