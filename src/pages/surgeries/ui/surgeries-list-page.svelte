<script lang="ts">
	import { apiGetSurgeries } from '@/shared/api';
	import type { Surgery } from '@/shared/api';
	import { SurgeryCard } from '@/features/surgeries';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import * as Select from '@/shared/ui/select';
	import { SurgeryStatus } from '@/shared/api/types';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let surgeries = $state<Surgery[]>([]);
	let isLoading = $state(true);
	let error = $state('');
	let statusFilter = $state('');
	let page = $state(1);
	let totalPages = $state(1);

	const statusOptions = [
		{ value: '', label: 'Все статусы' },
		{ value: SurgeryStatus.SCHEDULED, label: 'Запланирована' },
		{ value: SurgeryStatus.COMPLETED, label: 'Завершена' },
		{ value: SurgeryStatus.CANCELLED, label: 'Отменена' },
	];

	onMount(() => loadSurgeries());

	async function loadSurgeries() {
		isLoading = true;
		error = '';
		try {
			const { data } = await apiGetSurgeries({
				page,
				limit: 20,
				status: statusFilter || undefined,
			});
			surgeries = data.data;
			totalPages = data.meta?.total_pages ?? 1;
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Ошибка загрузки';
		} finally {
			isLoading = false;
		}
	}
</script>

<svelte:head>
	<title>Операции — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Операции</h1>
	</div>

	<div class="mb-6">
		<Select.Root
			type="single"
			value={statusFilter}
			onValueChange={(v) => { statusFilter = v; page = 1; loadSurgeries(); }}
		>
			<Select.Trigger class="w-56">
				{statusOptions.find((o) => o.value === statusFilter)?.label ?? 'Все статусы'}
			</Select.Trigger>
			<Select.Content>
				{#each statusOptions as opt}
					<Select.Item value={opt.value}>{opt.label}</Select.Item>
				{/each}
			</Select.Content>
		</Select.Root>
	</div>

	{#if isLoading}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each Array(6) as _}
				<Skeleton class="h-32 rounded-lg" />
			{/each}
		</div>
	{:else if error}
		<p class="text-destructive">{error}</p>
	{:else if surgeries.length === 0}
		<p class="text-muted-foreground">Нет операций</p>
	{:else}
		<div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
			{#each surgeries as surgery}
				<SurgeryCard {surgery} onclick={() => goto(`/surgeries/${surgery.id}`)} />
			{/each}
		</div>

		{#if totalPages > 1}
			<div class="mt-6 flex items-center justify-center gap-2">
				<Button variant="outline" size="sm" disabled={page <= 1} onclick={() => { page--; loadSurgeries(); }}>
					Назад
				</Button>
				<span class="text-sm text-muted-foreground">Стр. {page} из {totalPages}</span>
				<Button variant="outline" size="sm" disabled={page >= totalPages} onclick={() => { page++; loadSurgeries(); }}>
					Далее
				</Button>
			</div>
		{/if}
	{/if}
</div>
