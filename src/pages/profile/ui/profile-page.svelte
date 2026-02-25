<script lang="ts">
	import { authStore } from '@/entities/user';
	import { UserRole } from '@/shared/api/types';
	import { Button } from '@/shared/ui/button';
	import { Badge } from '@/shared/ui/badge';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from '@/shared/ui/card';
	import { Separator } from '@/shared/ui/separator';

	const roleLabels: Record<string, string> = {
		[UserRole.ADMIN]: 'Администратор',
		[UserRole.SURGEON]: 'Хирург',
		[UserRole.DISTRICT_DOCTOR]: 'Районный врач',
		[UserRole.PATIENT]: 'Пациент',
	};

	const fullName = $derived(
		authStore.user
			? [authStore.user.last_name, authStore.user.first_name, authStore.user.middle_name]
					.filter(Boolean)
					.join(' ') || authStore.user.name
			: ''
	);
</script>

<svelte:head>
	<title>Профиль — Oculus-Feldsher</title>
</svelte:head>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<Card>
			<CardHeader>
				<div class="flex items-center justify-between">
					<div>
						<CardTitle>Профиль</CardTitle>
						<CardDescription>Информация о вашем аккаунте</CardDescription>
					</div>
					{#if authStore.user?.role}
						<Badge variant="secondary">{roleLabels[authStore.user.role] ?? authStore.user.role}</Badge>
					{/if}
				</div>
			</CardHeader>

			<CardContent class="flex flex-col gap-4">
				{#if authStore.user}
					<div class="flex flex-col gap-1">
						<span class="text-sm text-muted-foreground">ФИО</span>
						<span class="text-base font-medium">{fullName}</span>
					</div>

					<div class="flex flex-col gap-1">
						<span class="text-sm text-muted-foreground">Email</span>
						<span class="text-base font-medium">{authStore.user.email}</span>
					</div>

					{#if authStore.user.phone}
						<div class="flex flex-col gap-1">
							<span class="text-sm text-muted-foreground">Телефон</span>
							<span class="text-base font-medium">{authStore.user.phone}</span>
						</div>
					{/if}

					{#if authStore.user.specialization}
						<div class="flex flex-col gap-1">
							<span class="text-sm text-muted-foreground">Специализация</span>
							<span class="text-base font-medium">{authStore.user.specialization}</span>
						</div>
					{/if}

					{#if authStore.user.license_number}
						<div class="flex flex-col gap-1">
							<span class="text-sm text-muted-foreground">Номер лицензии</span>
							<span class="text-base font-medium">{authStore.user.license_number}</span>
						</div>
					{/if}

					<Separator />

					<Button variant="destructive" onclick={() => authStore.logout()}>
						Выйти из аккаунта
					</Button>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
