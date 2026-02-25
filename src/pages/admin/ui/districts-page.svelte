<script lang="ts">
	import { districtStore } from '@/entities/district';
	import { DistrictForm } from '@/features/districts';
	import { authStore } from '@/entities/user';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import * as Table from '@/shared/ui/table';
	import * as Dialog from '@/shared/ui/dialog';
	import { Skeleton } from '@/shared/ui/skeleton';
	import type { District } from '@/shared/api';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	let { editDistrictId }: { editDistrictId?: number } = $props();

	let showCreateDialog = $state(false);
	let editingDistrict = $state<District | null>(null);
	let isSubmitting = $state(false);

	onMount(async () => {
		await districtStore.fetchDistricts();
		if (editDistrictId) {
			editingDistrict = districtStore.districts.find((d) => d.id === editDistrictId) ?? null;
		}
	});

	async function handleCreate(data: { name: string; region: string; description?: string }) {
		isSubmitting = true;
		try {
			await districtStore.create(data);
			showCreateDialog = false;
		} finally {
			isSubmitting = false;
		}
	}

	async function handleUpdate(data: { name: string; region: string; description?: string }) {
		if (!editingDistrict) return;
		isSubmitting = true;
		try {
			await districtStore.update(editingDistrict.id, data);
			editingDistrict = null;
			goto('/admin/districts');
		} finally {
			isSubmitting = false;
		}
	}

	async function handleDelete(id: number) {
		await districtStore.remove(id);
	}
</script>

<svelte:head>
	<title>Районы — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Районы</h1>
		{#if authStore.isAdmin}
			<Button onclick={() => (showCreateDialog = true)}>Добавить район</Button>
		{/if}
	</div>

	{#if districtStore.isLoading}
		<Skeleton class="h-64" />
	{:else if districtStore.districts.length === 0}
		<p class="text-muted-foreground">Нет районов</p>
	{:else}
		<Card>
			<CardContent class="p-0">
				<Table.Root>
					<Table.Header>
						<Table.Row>
							<Table.Head>Название</Table.Head>
							<Table.Head>Регион</Table.Head>
							<Table.Head>Описание</Table.Head>
							{#if authStore.isAdmin}
								<Table.Head class="w-32">Действия</Table.Head>
							{/if}
						</Table.Row>
					</Table.Header>
					<Table.Body>
						{#each districtStore.districts as district}
							<Table.Row>
								<Table.Cell class="font-medium">{district.name}</Table.Cell>
								<Table.Cell>{district.region}</Table.Cell>
								<Table.Cell class="text-muted-foreground">{district.code ?? '—'}</Table.Cell>
								{#if authStore.isAdmin}
									<Table.Cell>
										<div class="flex gap-1">
											<Button
												variant="ghost"
												size="sm"
												onclick={() => (editingDistrict = district)}
											>
												Изменить
											</Button>
											<Button
												variant="ghost"
												size="sm"
												class="text-destructive"
												onclick={() => handleDelete(district.id)}
											>
												Удалить
											</Button>
										</div>
									</Table.Cell>
								{/if}
							</Table.Row>
						{/each}
					</Table.Body>
				</Table.Root>
			</CardContent>
		</Card>
	{/if}

	<!-- Create dialog -->
	<Dialog.Root bind:open={showCreateDialog}>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Новый район</Dialog.Title>
			</Dialog.Header>
			<DistrictForm onsubmit={handleCreate} {isSubmitting} />
		</Dialog.Content>
	</Dialog.Root>

	<!-- Edit dialog -->
	<Dialog.Root
		open={editingDistrict !== null}
		onOpenChange={(v) => { if (!v) { editingDistrict = null; goto('/admin/districts'); } }}
	>
		<Dialog.Content>
			<Dialog.Header>
				<Dialog.Title>Редактировать район</Dialog.Title>
			</Dialog.Header>
			{#if editingDistrict}
				<DistrictForm district={editingDistrict} onsubmit={handleUpdate} {isSubmitting} />
			{/if}
		</Dialog.Content>
	</Dialog.Root>
</div>
