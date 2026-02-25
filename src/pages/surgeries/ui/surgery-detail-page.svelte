<script lang="ts">
	import { apiGetSurgery, apiUpdateSurgery } from '@/shared/api';
	import type { Surgery } from '@/shared/api';
	import { SurgeryStatus, OperationType, Eye } from '@/shared/api/types';
	import { authStore } from '@/entities/user';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import { Badge } from '@/shared/ui/badge';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { Textarea } from '@/shared/ui/textarea';
	import * as Select from '@/shared/ui/select';
	import { onMount } from 'svelte';

	let { surgeryId }: { surgeryId: number } = $props();

	let surgery = $state<Surgery | null>(null);
	let isLoading = $state(true);
	let error = $state('');
	let isUpdating = $state(false);
	let newStatus = $state('');
	let notes = $state('');

	onMount(async () => {
		try {
			const { data } = await apiGetSurgery(surgeryId);
			surgery = data.data;
			notes = surgery.notes ?? '';
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Ошибка загрузки';
		} finally {
			isLoading = false;
		}
	});

	const operationLabels: Record<string, string> = {
		[OperationType.PHACOEMULSIFICATION]: 'Факоэмульсификация',
		[OperationType.ANTIGLAUCOMA]: 'Антиглаукомная',
		[OperationType.VITRECTOMY]: 'Витрэктомия',
	};

	const statusLabels: Record<string, string> = {
		[SurgeryStatus.SCHEDULED]: 'Запланирована',
		[SurgeryStatus.COMPLETED]: 'Завершена',
		[SurgeryStatus.CANCELLED]: 'Отменена',
	};

	async function updateSurgery() {
		if (!surgery) return;
		isUpdating = true;
		try {
			const { data } = await apiUpdateSurgery(surgeryId, {
				status: (newStatus as SurgeryStatus) || undefined,
				notes: notes || undefined,
			});
			surgery = data.data;
			newStatus = '';
		} catch (e: any) {
			error = e.response?.data?.detail ?? 'Ошибка обновления';
		} finally {
			isUpdating = false;
		}
	}
</script>

<svelte:head>
	<title>Операция — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-8">
	{#if isLoading}
		<Skeleton class="h-96" />
	{:else if surgery}
		<div class="mb-6 flex items-center gap-3">
			<h1 class="text-2xl font-bold">{operationLabels[surgery.operation_type] ?? surgery.operation_type}</h1>
			<Badge>{statusLabels[surgery.status] ?? surgery.status}</Badge>
		</div>

		<Card class="mb-6">
			<CardContent class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
				<div>
					<span class="text-sm text-muted-foreground">Дата</span>
					<p class="font-medium">{new Date(surgery.scheduled_date).toLocaleString('ru-RU')}</p>
				</div>
				<div>
					<span class="text-sm text-muted-foreground">Глаз</span>
					<p class="font-medium">{surgery.eye === Eye.OS ? 'Левый (OS)' : surgery.eye === Eye.OD ? 'Правый (OD)' : 'Оба (OU)'}</p>
				</div>
				{#if surgery.patient}
					<div>
						<span class="text-sm text-muted-foreground">Пациент</span>
						<p class="font-medium">
							<a href="/patients/{surgery.patient.id}" class="text-primary hover:underline">
								{surgery.patient.last_name} {surgery.patient.first_name}
							</a>
						</p>
					</div>
				{/if}
				{#if surgery.notes}
					<div class="sm:col-span-2">
						<span class="text-sm text-muted-foreground">Заметки</span>
						<p class="font-medium">{surgery.notes}</p>
					</div>
				{/if}
			</CardContent>
		</Card>

		{#if (authStore.isSurgeon || authStore.isAdmin) && surgery.status !== SurgeryStatus.COMPLETED && surgery.status !== SurgeryStatus.CANCELLED}
			<Card>
				<CardHeader>
					<CardTitle class="text-base">Обновить операцию</CardTitle>
				</CardHeader>
				<CardContent class="flex flex-col gap-4">
					{#if error}
						<p class="text-sm text-destructive">{error}</p>
					{/if}
					<Select.Root type="single" onValueChange={(v) => (newStatus = v)}>
						<Select.Trigger>
							{statusLabels[newStatus] ?? 'Изменить статус'}
						</Select.Trigger>
						<Select.Content>
							<Select.Item value={SurgeryStatus.COMPLETED}>Завершена</Select.Item>
							<Select.Item value={SurgeryStatus.CANCELLED}>Отменена</Select.Item>
						</Select.Content>
					</Select.Root>
					<Textarea bind:value={notes} placeholder="Заметки" />
					<Button onclick={updateSurgery} disabled={isUpdating}>
						{isUpdating ? 'Обновление...' : 'Обновить'}
					</Button>
				</CardContent>
			</Card>
		{/if}
	{:else}
		<p class="text-destructive">{error || 'Операция не найдена'}</p>
	{/if}
</div>
