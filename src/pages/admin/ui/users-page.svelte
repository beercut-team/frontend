<script lang="ts">
	import { userStore } from '@/entities/user';
	import { authStore } from '@/entities/user';
	import { Card, CardContent } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import * as Table from '@/shared/ui/table';
	import * as Select from '@/shared/ui/select';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { UserRole } from '@/shared/api/types';
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';

	let selectedRole = $state<string>('all');

	const roleLabels: Record<string, string> = {
		all: 'Все роли',
		[UserRole.ADMIN]: 'Администратор',
		[UserRole.SURGEON]: 'Хирург',
		[UserRole.DISTRICT_DOCTOR]: 'Районный врач',
		[UserRole.PATIENT]: 'Пациент',
	};

	onMount(async () => {
		if (!authStore.isAdmin) {
			goto('/dashboard');
			return;
		}
		await userStore.fetchUsers();
	});

	async function handleRoleFilter(role: string) {
		selectedRole = role;
		await userStore.fetchUsers({ role: role === 'all' ? undefined : role });
	}

	const filteredUsers = $derived(
		selectedRole === 'all'
			? userStore.users
			: userStore.users.filter((u) => u.role === selectedRole)
	);
</script>

<svelte:head>
	<title>Пользователи — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-8">
	<div class="mb-6 flex items-center justify-between">
		<h1 class="text-2xl font-bold">Пользователи</h1>
		<div class="flex items-center gap-2">
			<Select.Root type="single" onValueChange={(v: string) => v && handleRoleFilter(v)}>
				<Select.Trigger class="w-48">
					{roleLabels[selectedRole]}
				</Select.Trigger>
				<Select.Content>
					<Select.Item value="all">Все роли</Select.Item>
					<Select.Item value={UserRole.ADMIN}>Администратор</Select.Item>
					<Select.Item value={UserRole.SURGEON}>Хирург</Select.Item>
					<Select.Item value={UserRole.DISTRICT_DOCTOR}>Районный врач</Select.Item>
					<Select.Item value={UserRole.PATIENT}>Пациент</Select.Item>
				</Select.Content>
			</Select.Root>
		</div>
	</div>

	{#if userStore.isLoading}
		<Skeleton class="h-96" />
	{:else if userStore.error}
		<p class="text-destructive">{userStore.error}</p>
	{:else if filteredUsers.length === 0}
		<p class="text-muted-foreground">Нет пользователей</p>
	{:else}
		<Card>
			<CardContent class="p-0">
				<div class="overflow-x-auto">
					<Table.Root>
						<Table.Header>
							<Table.Row>
								<Table.Head>ФИО</Table.Head>
								<Table.Head>Email</Table.Head>
								<Table.Head>Роль</Table.Head>
								<Table.Head>Телефон</Table.Head>
								<Table.Head>Специализация</Table.Head>
								<Table.Head>Статус</Table.Head>
							</Table.Row>
						</Table.Header>
						<Table.Body>
							{#each filteredUsers as user}
								<Table.Row>
									<Table.Cell class="font-medium">
										{#if user.first_name && user.last_name}
											{user.last_name} {user.first_name}
											{#if user.middle_name}
												{user.middle_name}
											{/if}
										{:else}
											{user.name}
										{/if}
									</Table.Cell>
									<Table.Cell>{user.email}</Table.Cell>
									<Table.Cell>
										<span class="rounded-full px-2 py-1 text-xs font-medium bg-accent">
											{roleLabels[user.role] ?? user.role}
										</span>
									</Table.Cell>
									<Table.Cell class="text-muted-foreground">{user.phone ?? '—'}</Table.Cell>
									<Table.Cell class="text-muted-foreground">{user.specialization ?? '—'}</Table.Cell>
									<Table.Cell>
										{#if user.is_active}
											<span class="text-green-600">Активен</span>
										{:else}
											<span class="text-muted-foreground">Неактивен</span>
										{/if}
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
