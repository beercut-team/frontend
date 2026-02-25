<script lang="ts">
	import { authStore } from '@/entities/user';
	import { UserRole, PatientStatus } from '@/shared/api/types';
	import { patientStore, PatientCard } from '@/entities/patient';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { onMount } from 'svelte';
	import { apiGetSurgeries } from '@/shared/api';
	import type { Surgery } from '@/shared/api';
	import { SurgeryCard } from '@/features/surgeries';
	import { goto } from '$app/navigation';

	let surgeries = $state<Surgery[]>([]);

	onMount(async () => {
		await patientStore.fetchDashboard();
		if (authStore.isSurgeon) {
			try {
				const { data } = await apiGetSurgeries({ limit: 5, status: 'SCHEDULED' });
				surgeries = data.data;
			} catch { /* ignore */ }
		}
	});

	const dashboard = $derived(patientStore.dashboard);

	const statusLabels: Record<string, string> = {
		[PatientStatus.NEW]: 'Новые',
		[PatientStatus.PREPARATION]: 'Подготовка',
		[PatientStatus.REVIEW_NEEDED]: 'Требует проверки',
		[PatientStatus.APPROVED]: 'Одобрено',
		[PatientStatus.SURGERY_SCHEDULED]: 'Операция назначена',
		[PatientStatus.COMPLETED]: 'Завершено',
		[PatientStatus.REJECTED]: 'Отклонено',
	};

	const roleTitles: Record<string, string> = {
		[UserRole.ADMIN]: 'Панель администратора',
		[UserRole.SURGEON]: 'Панель хирурга',
		[UserRole.DISTRICT_DOCTOR]: 'Панель врача',
		[UserRole.PATIENT]: 'Мой статус',
	};
</script>

<svelte:head>
	<title>Дашборд — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-8">
	<div class="mb-8 flex items-center justify-between">
		<div>
			<h1 class="text-2xl font-bold">
				{roleTitles[authStore.user?.role ?? ''] ?? 'Дашборд'}
			</h1>
			<p class="text-muted-foreground">
				Добро пожаловать, {authStore.user?.first_name || authStore.user?.name}
			</p>
		</div>
		{#if !authStore.isPatient}
			<Button href="/patients/new">Новый пациент</Button>
		{/if}
	</div>

	{#if patientStore.isLoading}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			{#each Array(4) as _}
				<Skeleton class="h-24 rounded-lg" />
			{/each}
		</div>
	{:else if dashboard}
		<!-- Stats cards -->
		<div class="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
			<Card>
				<CardHeader class="pb-2">
					<CardTitle class="text-sm text-muted-foreground">Всего пациентов</CardTitle>
				</CardHeader>
				<CardContent>
					<p class="text-3xl font-bold">{dashboard.total_patients}</p>
				</CardContent>
			</Card>
			{#each Object.entries(dashboard.by_status) as [status, count]}
				{#if count > 0}
					<Card>
						<CardHeader class="pb-2">
							<CardTitle class="text-sm text-muted-foreground">{statusLabels[status] ?? status}</CardTitle>
						</CardHeader>
						<CardContent>
							<p class="text-3xl font-bold">{count}</p>
						</CardContent>
					</Card>
				{/if}
			{/each}
		</div>

		<!-- Recent patients -->
		{#if dashboard.recent_patients.length > 0}
			<div class="mb-8">
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold">Последние пациенты</h2>
					<Button variant="ghost" href="/patients">Все пациенты</Button>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each dashboard.recent_patients as patient}
						<PatientCard {patient} onclick={() => goto(`/patients/${patient.id}`)} />
					{/each}
				</div>
			</div>
		{/if}

		<!-- Surgeon: upcoming surgeries -->
		{#if authStore.isSurgeon && surgeries.length > 0}
			<div>
				<div class="mb-4 flex items-center justify-between">
					<h2 class="text-lg font-semibold">Запланированные операции</h2>
					<Button variant="ghost" href="/surgeries">Все операции</Button>
				</div>
				<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{#each surgeries as surgery}
						<SurgeryCard {surgery} onclick={() => goto(`/surgeries/${surgery.id}`)} />
					{/each}
				</div>
			</div>
		{/if}
	{:else if patientStore.error}
		<p class="text-destructive">{patientStore.error}</p>
	{/if}
</div>
