<script lang="ts">
	import { authStore } from '@/entities/user';
	import { UserRole, PatientStatus } from '@/shared/api/types';
	import { patientStore, PatientCard, PatientStatusBadge } from '@/entities/patient';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { onMount } from 'svelte';
	import { apiGetSurgeries, apiGetPatient, apiGetChecklistProgress } from '@/shared/api';
	import { apiGetComments } from '@/entities/comment';
	import type { Surgery, Patient, ChecklistProgress } from '@/shared/api';
	import type { Comment } from '@/entities/comment';
	import { SurgeryCard } from '@/features/surgeries';
	import { ChecklistProgressBar } from '@/features/checklists';
	import { goto } from '$app/navigation';

	let surgeries = $state<Surgery[]>([]);
	let patientData = $state<Patient | null>(null);
	let checklistProgress = $state<ChecklistProgress | null>(null);
	let comments = $state<Comment[]>([]);
	let isLoadingPatient = $state(false);

	onMount(async () => {
		if (authStore.isPatient) {
			// Load patient's own data
			isLoadingPatient = true;
			try {
				// Try to get patient data by user ID (assuming user.id === patient.id)
				const userId = authStore.user?.id;
				if (userId) {
					const [patientRes, progressRes, commentsRes, surgeriesRes] = await Promise.allSettled([
						apiGetPatient(userId),
						apiGetChecklistProgress(userId),
						apiGetComments(userId),
						apiGetSurgeries({ limit: 10 }),
					]);

					if (patientRes.status === 'fulfilled') {
						patientData = patientRes.value.data.data;
					}
					if (progressRes.status === 'fulfilled') {
						checklistProgress = progressRes.value.data.data;
					}
					if (commentsRes.status === 'fulfilled') {
						comments = commentsRes.value.data.data;
					}
					if (surgeriesRes.status === 'fulfilled') {
						surgeries = surgeriesRes.value.data.data.filter((s) => s.patient_id === userId);
					}
				}
			} catch { /* ignore */ } finally {
				isLoadingPatient = false;
			}
		} else {
			// Load staff dashboard
			await patientStore.fetchDashboard();
			if (authStore.isSurgeon) {
				try {
					const { data } = await apiGetSurgeries({ limit: 5, status: 'SCHEDULED' });
					surgeries = data.data;
				} catch { /* ignore */ }
			}
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

	const fullName = $derived(
		patientData
			? [patientData.last_name, patientData.first_name, patientData.middle_name].filter(Boolean).join(' ')
			: authStore.user?.first_name || authStore.user?.name
	);
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
				Добро пожаловать, {fullName}
			</p>
		</div>
		{#if !authStore.isPatient}
			<Button href="/patients/new">Новый пациент</Button>
		{/if}
	</div>

	{#if authStore.isPatient}
		<!-- Patient Dashboard -->
		{#if isLoadingPatient}
			<div class="grid grid-cols-1 gap-4">
				<Skeleton class="h-32 rounded-lg" />
				<Skeleton class="h-48 rounded-lg" />
			</div>
		{:else if patientData}
			<div class="grid grid-cols-1 gap-6">
				<!-- Status Card -->
				<Card>
					<CardHeader>
						<CardTitle>Текущий статус</CardTitle>
						<CardDescription>Информация о вашем лечении</CardDescription>
					</CardHeader>
					<CardContent class="flex flex-col gap-4">
						<div class="flex items-center gap-3">
							<span class="text-sm text-muted-foreground">Статус:</span>
							<PatientStatusBadge status={patientData.status} />
						</div>
						{#if patientData.diagnosis}
							<div>
								<span class="text-sm text-muted-foreground">Диагноз:</span>
								<p class="mt-1 text-sm">{patientData.diagnosis}</p>
							</div>
						{/if}
						{#if patientData.surgery_date}
							<div>
								<span class="text-sm text-muted-foreground">Дата операции:</span>
								<p class="mt-1 text-sm font-medium">
									{new Date(patientData.surgery_date).toLocaleDateString('ru-RU', {
										year: 'numeric',
										month: 'long',
										day: 'numeric',
									})}
								</p>
							</div>
						{/if}
					</CardContent>
				</Card>

				<!-- Checklist Progress -->
				{#if checklistProgress}
					<Card>
						<CardHeader>
							<CardTitle>Прогресс подготовки</CardTitle>
							<CardDescription>
								Выполнено {checklistProgress.completed} из {checklistProgress.total} пунктов
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ChecklistProgressBar progress={checklistProgress} />
							<Button href="/patients/{patientData.id}" variant="outline" class="mt-4 w-full">
								Посмотреть детали
							</Button>
						</CardContent>
					</Card>
				{/if}

				<!-- Recent Comments -->
				{#if comments.length > 0}
					<Card>
						<CardHeader>
							<CardTitle>Комментарии врачей</CardTitle>
							<CardDescription>Последние сообщения от медицинского персонала</CardDescription>
						</CardHeader>
						<CardContent class="flex flex-col gap-3">
							{#each comments.slice(0, 3) as comment}
								<div class="rounded-lg border p-3 {comment.is_urgent ? 'border-destructive/50 bg-destructive/5' : ''}">
									<div class="mb-1 flex items-center gap-2">
										<span class="text-sm font-medium">
											{comment.author ? `${comment.author.first_name ?? ''} ${comment.author.last_name ?? comment.author.name}`.trim() : 'Врач'}
										</span>
										<span class="text-xs text-muted-foreground">
											{new Date(comment.created_at).toLocaleDateString('ru-RU')}
										</span>
									</div>
									<p class="text-sm">{comment.body}</p>
								</div>
							{/each}
							{#if comments.length > 3}
								<Button href="/patients/{patientData.id}" variant="ghost" class="w-full">
									Показать все комментарии
								</Button>
							{/if}
						</CardContent>
					</Card>
				{/if}

				<!-- Surgery Info -->
				{#if surgeries.length > 0}
					<Card>
						<CardHeader>
							<CardTitle>Запланированные операции</CardTitle>
						</CardHeader>
						<CardContent class="flex flex-col gap-3">
							{#each surgeries as surgery}
								<div class="rounded-lg border p-3">
									<div class="flex items-center justify-between">
										<span class="text-sm font-medium">
											{new Date(surgery.scheduled_date).toLocaleDateString('ru-RU', {
												year: 'numeric',
												month: 'long',
												day: 'numeric',
												hour: '2-digit',
												minute: '2-digit',
											})}
										</span>
										<span class="text-xs text-muted-foreground">{surgery.status}</span>
									</div>
									{#if surgery.notes}
										<p class="mt-2 text-sm text-muted-foreground">{surgery.notes}</p>
									{/if}
								</div>
							{/each}
						</CardContent>
					</Card>
				{/if}
			</div>
		{:else}
			<Card>
				<CardContent class="py-8 text-center">
					<p class="text-muted-foreground">Не удалось загрузить информацию о пациенте</p>
				</CardContent>
			</Card>
		{/if}
	{:else}
		<!-- Staff Dashboard - Profile View -->
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Profile Card -->
			<div class="lg:col-span-1">
				<Card>
					<CardHeader>
						<CardTitle>Профиль</CardTitle>
					</CardHeader>
					<CardContent class="flex flex-col gap-4">
						<div>
							<span class="text-sm text-muted-foreground">ФИО</span>
							<p class="mt-1 font-medium">{fullName}</p>
						</div>
						<div>
							<span class="text-sm text-muted-foreground">Роль</span>
							<p class="mt-1 font-medium">
								{authStore.isSurgeon ? 'Хирург' : authStore.isDistrictDoctor ? 'Районный врач' : authStore.isAdmin ? 'Администратор' : 'Сотрудник'}
							</p>
						</div>
						{#if authStore.user?.email}
							<div>
								<span class="text-sm text-muted-foreground">Email</span>
								<p class="mt-1 font-medium">{authStore.user.email}</p>
							</div>
						{/if}
						{#if authStore.user?.phone}
							<div>
								<span class="text-sm text-muted-foreground">Телефон</span>
								<p class="mt-1 font-medium">{authStore.user.phone}</p>
							</div>
						{/if}
						{#if authStore.user?.specialization}
							<div>
								<span class="text-sm text-muted-foreground">Специализация</span>
								<p class="mt-1 font-medium">{authStore.user.specialization}</p>
							</div>
						{/if}
					</CardContent>
				</Card>
			</div>

			<!-- Quick Actions -->
			<div class="lg:col-span-2">
				<Card>
					<CardHeader>
						<CardTitle>Быстрые действия</CardTitle>
						<CardDescription>Часто используемые функции</CardDescription>
					</CardHeader>
					<CardContent class="grid grid-cols-1 gap-3 sm:grid-cols-2">
						<Button href="/patients" variant="outline" class="h-auto flex-col items-start gap-2 p-4">
							<span class="text-lg">👥</span>
							<div class="text-left">
								<p class="font-semibold">Пациенты</p>
								<p class="text-xs text-muted-foreground">Просмотр всех пациентов</p>
							</div>
						</Button>
						<Button href="/patients/new" variant="outline" class="h-auto flex-col items-start gap-2 p-4">
							<span class="text-lg">➕</span>
							<div class="text-left">
								<p class="font-semibold">Новый пациент</p>
								<p class="text-xs text-muted-foreground">Добавить пациента</p>
							</div>
						</Button>
						{#if authStore.isAdmin}
							<Button href="/districts" variant="outline" class="h-auto flex-col items-start gap-2 p-4">
								<span class="text-lg">🏥</span>
								<div class="text-left">
									<p class="font-semibold">Районы</p>
									<p class="text-xs text-muted-foreground">Управление районами</p>
								</div>
							</Button>
						{/if}
						<Button href="/profile" variant="outline" class="h-auto flex-col items-start gap-2 p-4">
							<span class="text-lg">⚙️</span>
							<div class="text-left">
								<p class="font-semibold">Настройки</p>
								<p class="text-xs text-muted-foreground">Редактировать профиль</p>
							</div>
						</Button>
					</CardContent>
				</Card>

				{#if patientStore.isLoading}
					<Skeleton class="mt-6 h-32 rounded-lg" />
				{:else if dashboard}
					<!-- Stats Overview -->
					<Card class="mt-6">
						<CardHeader>
							<CardTitle>Статистика</CardTitle>
							<CardDescription>Общая информация по пациентам</CardDescription>
						</CardHeader>
						<CardContent class="grid grid-cols-2 gap-4 sm:grid-cols-3">
							<div class="rounded-lg border p-3">
								<p class="text-sm text-muted-foreground">Всего</p>
								<p class="text-2xl font-bold">{dashboard.total_patients ?? 0}</p>
							</div>
							{#each Object.entries(dashboard.by_status ?? {}).slice(0, 5) as [status, count]}
								{#if count > 0}
									<div class="rounded-lg border p-3">
										<p class="text-sm text-muted-foreground">{statusLabels[status] ?? status}</p>
										<p class="text-2xl font-bold">{count}</p>
									</div>
								{/if}
							{/each}
						</CardContent>
					</Card>
				{/if}
			</div>
		</div>
	{/if}
</div>
