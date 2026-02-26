<script lang="ts">
	import { authStore } from '@/entities/user';
	import { UserRole, PatientStatus } from '@/shared/api/types';
	import { patientStore, PatientCard, PatientStatusBadge } from '@/entities/patient';
	import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import { Skeleton } from '@/shared/ui/skeleton';
	import { onMount } from 'svelte';
	import { apiGetSurgeries, apiGetPatient, apiGetChecklistProgress, apiGetComments } from '@/shared/api';
	import type { Surgery, Patient, ChecklistProgress, Comment } from '@/shared/api';
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
		<!-- Staff Dashboard -->
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
						<p class="text-3xl font-bold">{dashboard.total_patients ?? 0}</p>
					</CardContent>
				</Card>
				{#each Object.entries(dashboard.by_status ?? {}) as [status, count]}
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
			{#if dashboard.recent_patients && dashboard.recent_patients.length > 0}
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
	{/if}
</div>
