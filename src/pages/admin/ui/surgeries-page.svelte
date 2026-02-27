<script lang="ts">
	import { surgeryStore } from '@/entities/surgery';
	import { authStore } from '@/entities/user';
	import { Card, CardContent } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import * as Table from '@/shared/ui/table';
	import * as Select from '@/shared/ui/select';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { SurgeryStatus } from '@/shared/api/types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let selectedStatus = $state<string>('all');

	const statusLabels: Record<string, string> = {
		all: 'Все статусы',
		[SurgeryStatus.SCHEDULED]: 'Запланирована',
		[SurgeryStatus.COMPLETED]: 'Завершена',
		[SurgeryStatus.CANCELLED]: 'Отменена',
	};

	onMount(async () => {
		if (!authStore.isAdmin) {
			goto('/dashboard');
			return;
		}
		await surgeryStore.fetchSurgeries();
	});

	async function handleStatusFilter(status: string) {
		selectedStatus = status;
		await surgeryStore.fetchSurgeries({ status: status === 'all' ? undefined : status });
	}

	const filteredSurgeries = $derived(
		selectedStatus === 'all'
			? surgeryStore.surgeries
			: surgeryStore.surgeries.filter((s) => s.status === selectedStatus)
	);

	function formatDate(dateString: string) {
		return new Date(dateString).toLocaleDateString('ru-RU', {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit',
		});
	}

	function getPatientName(surgery: any) {
		if (!surgery.patient) return '—';
		const p = surgery.patient;
		return `${p.last_name} ${p.first_name}${p.middle_name ? ' ' + p.middle_name : ''}`;
	}
</script>

<svelte:head>
	<title>Операции — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Операции</h1>
		<div class="flex items-center gap-2">
			<Select.Root type="single" onValueChange={(v: string) => v && handleStatusFilter(v)}>
				<Select.Trigger class="w-48">
					{statusLabels[selectedStatus]}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="all">Все статусы</Select.Item>
					<Select.Item value={SurgeryStatus.SCHEDULED}>Запланирована</Select.Item>
					<Select.Item value={SurgeryStatus.COMPLETED}>Завершена</Select.Item>
					<Select.Item value={SurgeryStatus.CANCELLED}>Отменена</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	{#if surgeryStore.isLoading}
		<Skeleton class="h-96" />
	{:else if surgeryStore.error}
		<p class="text-destructive">{surgeryStore.error}</p>
	{:else if filteredSurgeries.length === 0}
		<p class="text-muted-foreground">Нет операций</p>
	{:else}
		<Card>
			<CardContent class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>Пациент</Table.Head>
								<Table.Head>Хирург</Table.Head>
								<Table.Head>Дата операции</Table.Head>
								<Table.Head>Тип операции</Table.Head>
								<Table.Head>Глаз</Table.Head>
								<Table.Head>Статус</Table.Head>
								<Table.Head class="w-32">Действия</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredSurgeries as surgery}
								<Table.Row>
									<Table.Cell class="font-medium">
										{getPatientName(surgery)}
									</Table.Cell>
									<Table.Cell>
										{#if surgery.surgeon}
											{surgery.surgeon.last_name} {surgery.surgeon.first_name}
										{:else}
											—
										{/if}
									</Table.Cell>
									<Table.Cell>{formatDate(surgery.scheduled_date)}</Table.Cell>
									<Table.Cell>{surgery.operation_type}</Table.Cell>
									<Table.Cell>{surgery.eye}</Table.Cell>
									<Table.Cell>
										<span
											class="rounded-full px-2 py-1 text-xs font-medium"
											class:bg-blue-100={surgery.status === SurgeryStatus.SCHEDULED}
											class:text-blue-800={surgery.status === SurgeryStatus.SCHEDULED}
											class:bg-green-100={surgery.status === SurgeryStatus.COMPLETED}
											class:text-green-800={surgery.status === SurgeryStatus.COMPLETED}
											class:bg-gray-100={surgery.status === SurgeryStatus.CANCELLED}
											class:text-gray-800={surgery.status === SurgeryStatus.CANCELLED}
										>
											{statusLabels[surgery.status] ?? surgery.status}
										</span>
									</Table.Cell>
									<Table.Cell>
										<Button
											variant="ghost"
											size="sm"
											href="/patients/{surgery.patient_id}"
										>
											Подробнее
										</Button>
									</Table.Cell>
								</Table.Row>
							{/each}
						</Table.Body>
					</Table.Root>
				</div>
			</CardContent>
		</Card>
	{/if}
</div>
