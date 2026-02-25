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
		try {
			const res = await apiGetPatientPublicStatus(code);
			data = res.data.data;
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Пациент не найден';
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
				<CardTitle>{data.patient_name}</CardTitle>
				<CardDescription>
					Последнее обновление: {new Date(data.last_updated).toLocaleString('ru-RU')}
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
			<CardContent class="py-8 text-center">
				<p class="text-destructive">{error}</p>
			</CardContent>
		</Card>
	{/if}
</div>
