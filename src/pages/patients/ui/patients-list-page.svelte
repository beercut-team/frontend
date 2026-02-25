<script lang="ts">
	import { patientStore, PatientCard } from '@/entities/patient';
	import { PatientFilters } from '@/features/patients';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { authStore } from '@/entities/user';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let search = $state('');
	let status = $state('');
	let page = $state(1);

	onMount(() => {
		loadPatients();
	});

	function loadPatients() {
		patientStore.fetchPatients({
			page,
			limit: 20,
			search: search || undefined,
			status: status || undefined,
		});
	}

	function handleSearch(val: string) {
		search = val;
		page = 1;
		loadPatients();
	}

	function handleStatus(val: string) {
		status = val;
		page = 1;
		loadPatients();
	}
</script>

<svelte:head>
	<title>Пациенты — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Пациенты</h1>
		{#if !authStore.isPatient}
			<Button href="/patients/new">Новый пациент</Button>
		{/if}
	</div>

	<div class="mb-6">
		<PatientFilters {search} {status} onsearch={handleSearch} onstatus={handleStatus} />
	</div>

	{#if patientStore.isLoading}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<Skeleton class="h-32 rounded-lg" />
			{/each}
		</div>
	{:else if patientStore.error}
		<p class="text-destructive">{patientStore.error}</p>
	{:else if patientStore.patients.length === 0}
		<p class="text-muted-foreground">Пациенты не найдены</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each patientStore.patients as patient}
				<PatientCard {patient} onclick={() => goto(`/patients/${patient.id}`)} />
			{/each}
		</div>

		{#if patientStore.meta && patientStore.meta.total_pages > 1}
			<div class="mt-6 flex items-center justify-center gap-2">
				<Button
					variant="outline"
					size="sm"
					disabled={page <= 1}
					onclick={() => { page--; loadPatients(); }}
				>
					Назад
				</Button>
				<span class="text-sm text-muted-foreground">
					Стр. {page} из {patientStore.meta.total_pages}
				</span>
				<Button
					variant="outline"
					size="sm"
					disabled={page >= (patientStore.meta?.total_pages ?? 1)}
					onclick={() => { page++; loadPatients(); }}
				>
					Далее
				</Button>
			</div>
		{/if}
	{/if}
</div>
