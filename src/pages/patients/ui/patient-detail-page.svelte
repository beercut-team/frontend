<script lang="ts">
	import { patientStore, PatientStatusBadge } from '@/entities/patient';
	import { authStore } from '@/entities/user';
	import { ChangeStatusDialog } from '@/features/patients';
	import { ChecklistList, ChecklistProgressBar, AddChecklistItemDialog } from '@/features/checklists';
	import { MediaUpload, MediaGallery } from '@/features/media';
	import { IOLForm, IOLResult, IOLHistory } from '@/features/iol-calculator';
	import { CommentThread, CommentForm } from '@/features/comments';
	import { SurgeryForm, SurgeryCard } from '@/features/surgeries';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import { Button } from '@/shared/ui/button';
	import { Separator } from '@/shared/ui/separator';
	import { Skeleton } from '@/shared/ui/skeleton';
	import * as Tabs from '@/shared/ui/tabs';
	import { apiGetChecklist, apiGetChecklistProgress, apiGetMedia, apiGetIOLHistory, apiGetSurgeries } from '@/shared/api';
	import { apiGetComments } from '@/entities/comment';
	import { downloadRoutingSheet, downloadChecklistReport } from '@/shared/api';
	import type { ChecklistItem, ChecklistProgress, Media, IOLCalculation, Surgery } from '@/shared/api';
	import type { Comment } from '@/entities/comment';
	import { onMount } from 'svelte';

	let { patientId, initialTab = 'info' }: { patientId: number; initialTab?: string } = $props();

	let checklist = $state<ChecklistItem[]>([]);
	let checklistProgress = $state<ChecklistProgress | null>(null);
	let media = $state<Media[]>([]);
	let iolHistory = $state<IOLCalculation[]>([]);
	let lastIOLResult = $state<IOLCalculation | null>(null);
	let comments = $state<Comment[]>([]);
	let surgeries = $state<Surgery[]>([]);
	let showStatusDialog = $state(false);
	let activeTab = $state(initialTab);

	const patient = $derived(patientStore.currentPatient);

	onMount(() => {
		patientStore.fetchPatient(patientId);
		loadChecklist();
		loadMedia();
		loadComments();
		loadSurgeries();
	});

	async function loadChecklist() {
		try {
			const [items, progress] = await Promise.all([
				apiGetChecklist(patientId),
				apiGetChecklistProgress(patientId),
			]);
			checklist = items.data.data;
			checklistProgress = progress.data.data;
		} catch { /* ignore */ }
	}

	async function loadMedia() {
		try {
			const { data } = await apiGetMedia(patientId);
			media = data.data;
		} catch { /* ignore */ }
	}

	async function loadIOLHistory() {
		try {
			const { data } = await apiGetIOLHistory(patientId);
			iolHistory = data.data;
		} catch { /* ignore */ }
	}

	async function loadComments() {
		try {
			const { data } = await apiGetComments(patientId);
			comments = data.data;
		} catch { /* ignore */ }
	}

	async function loadSurgeries() {
		try {
			const { data } = await apiGetSurgeries({ limit: 100 });
			surgeries = data.data.filter((s) => s.patient_id === patientId);
		} catch { /* ignore */ }
	}

	const fullName = $derived(
		patient
			? [patient.last_name, patient.first_name, patient.middle_name].filter(Boolean).join(' ')
			: ''
	);

	const canEditChecklist = $derived(authStore.isDistrictDoctor || authStore.isAdmin);
	const canReviewChecklist = $derived(authStore.isSurgeon || authStore.isAdmin);
	const canChangeStatus = $derived(!authStore.isPatient);
	const canUploadMedia = $derived(!authStore.isPatient);
	const canScheduleSurgery = $derived(authStore.isSurgeon || authStore.isAdmin);
</script>

<svelte:head>
	<title>{fullName || 'Пациент'} — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-6xl px-6 py-8">
	{#if patientStore.isLoading}
		<Skeleton class="mb-4 h-8 w-64" />
		<Skeleton class="h-96" />
	{:else if patient}
		<!-- Header -->
		<div class="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
			<div>
				<div class="flex items-center gap-3">
					<h1 class="text-2xl font-bold">{fullName}</h1>
					<PatientStatusBadge status={patient.status} />
				</div>
				<p class="text-muted-foreground">
					{patient.diagnosis ?? 'Диагноз не указан'}
				</p>
			</div>
			<div class="flex gap-2">
				{#if canChangeStatus}
					<Button variant="outline" onclick={() => (showStatusDialog = true)}>Изменить статус</Button>
				{/if}
				<Button variant="outline" onclick={() => downloadRoutingSheet(patientId)}>Маршрутный лист</Button>
				<Button variant="outline" onclick={() => downloadChecklistReport(patientId)}>Отчёт чек-листа</Button>
			</div>
		</div>

		<Tabs.Root bind:value={activeTab}>
			<Tabs.List class="w-full">
				<Tabs.Trigger value="info" class="flex-1">Информация</Tabs.Trigger>
				<Tabs.Trigger value="checklist" class="flex-1">Чек-лист</Tabs.Trigger>
				<Tabs.Trigger value="media" class="flex-1">Файлы</Tabs.Trigger>
				{#if canScheduleSurgery || surgeries.length > 0}
					<Tabs.Trigger value="surgeries" class="flex-1">Операции</Tabs.Trigger>
				{/if}
				{#if authStore.isSurgeon || authStore.isAdmin}
					<Tabs.Trigger value="iol" class="flex-1">ИОЛ</Tabs.Trigger>
				{/if}
				<Tabs.Trigger value="comments" class="flex-1">Комментарии</Tabs.Trigger>
			</Tabs.List>

			<div class="mt-6">
				<Tabs.Content value="info">
					<Card>
						<CardContent class="grid grid-cols-1 gap-4 p-6 sm:grid-cols-2">
							<div>
								<span class="text-sm text-muted-foreground">Дата рождения</span>
								<p class="font-medium">{new Date(patient.date_of_birth).toLocaleDateString('ru-RU')}</p>
							</div>
							<div>
								<span class="text-sm text-muted-foreground">Тип операции</span>
								<p class="font-medium">{patient.operation_type}</p>
							</div>
							<div>
								<span class="text-sm text-muted-foreground">Глаз</span>
								<p class="font-medium">{patient.eye}</p>
							</div>
							{#if patient.surgery_date}
								<div>
									<span class="text-sm text-muted-foreground">Дата операции</span>
									<p class="font-medium">{new Date(patient.surgery_date).toLocaleDateString('ru-RU')}</p>
								</div>
							{/if}
							{#if patient.phone}
								<div>
									<span class="text-sm text-muted-foreground">Телефон</span>
									<p class="font-medium">{patient.phone}</p>
								</div>
							{/if}
							{#if patient.email}
								<div>
									<span class="text-sm text-muted-foreground">Email</span>
									<p class="font-medium">{patient.email}</p>
								</div>
							{/if}
							{#if patient.snils}
								<div>
									<span class="text-sm text-muted-foreground">СНИЛС</span>
									<p class="font-medium">{patient.snils}</p>
								</div>
							{/if}
							{#if patient.passport_series || patient.passport_number}
								<div>
									<span class="text-sm text-muted-foreground">Паспорт</span>
									<p class="font-medium">{patient.passport_series} {patient.passport_number}</p>
								</div>
							{/if}
							{#if patient.policy_number}
								<div>
									<span class="text-sm text-muted-foreground">Полис ОМС</span>
									<p class="font-medium">{patient.policy_number}</p>
								</div>
							{/if}
							{#if patient.address}
								<div class="sm:col-span-2">
									<span class="text-sm text-muted-foreground">Адрес</span>
									<p class="font-medium">{patient.address}</p>
								</div>
							{/if}
							{#if patient.district}
								<div>
									<span class="text-sm text-muted-foreground">Район</span>
									<p class="font-medium">{patient.district.name}</p>
								</div>
							{/if}
							{#if patient.access_code}
								<div>
									<span class="text-sm text-muted-foreground">Код отслеживания</span>
									<p class="font-medium">{patient.access_code}</p>
								</div>
							{/if}
							{#if patient.doctor}
								<div>
									<span class="text-sm text-muted-foreground">Лечащий врач</span>
									<p class="font-medium">{patient.doctor.first_name} {patient.doctor.last_name}</p>
								</div>
							{/if}
							{#if patient.surgeon}
								<div>
									<span class="text-sm text-muted-foreground">Хирург</span>
									<p class="font-medium">{patient.surgeon.first_name || patient.surgeon.name} {patient.surgeon.last_name}</p>
								</div>
							{/if}
							{#if patient.notes}
								<div class="sm:col-span-2">
									<span class="text-sm text-muted-foreground">Заметки</span>
									<p class="font-medium">{patient.notes}</p>
								</div>
							{/if}
						</CardContent>
					</Card>
				</Tabs.Content>

				<Tabs.Content value="checklist">
					<div class="flex flex-col gap-6">
						{#if checklistProgress}
							<ChecklistProgressBar progress={checklistProgress} />
						{/if}
						{#if canEditChecklist}
							<div class="flex justify-end">
								<AddChecklistItemDialog {patientId} onSuccess={loadChecklist} />
							</div>
						{/if}
						<Separator />
						<ChecklistList
							items={checklist}
							canEdit={canEditChecklist}
							canReview={canReviewChecklist}
							onupdate={loadChecklist}
						/>
					</div>
				</Tabs.Content>

				<Tabs.Content value="media">
					<div class="flex flex-col gap-6">
						{#if canUploadMedia}
							<MediaUpload {patientId} onuploaded={loadMedia} />
						{/if}
						<MediaGallery {media} canDelete={canUploadMedia} ondelete={loadMedia} />
					</div>
				</Tabs.Content>

				<Tabs.Content value="surgeries">
					<div class="flex flex-col gap-6">
						{#if canScheduleSurgery}
							<Card>
								<CardHeader>
									<CardTitle class="text-base">Назначить операцию</CardTitle>
								</CardHeader>
								<CardContent>
									<SurgeryForm {patientId} oncreated={() => loadSurgeries()} />
								</CardContent>
							</Card>
						{/if}
						{#if surgeries.length > 0}
							<div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
								{#each surgeries as surgery}
									<SurgeryCard {surgery} />
								{/each}
							</div>
						{:else}
							<p class="text-sm text-muted-foreground">Нет назначенных операций</p>
						{/if}
					</div>
				</Tabs.Content>

				<Tabs.Content value="iol">
					<div class="flex flex-col gap-6">
						<Card>
							<CardHeader>
								<CardTitle class="text-base">Расчёт ИОЛ</CardTitle>
							</CardHeader>
							<CardContent>
								<IOLForm
									{patientId}
									oncalculated={(result) => {
										lastIOLResult = result;
										loadIOLHistory();
									}}
								/>
							</CardContent>
						</Card>
						{#if lastIOLResult}
							<IOLResult result={lastIOLResult} />
						{/if}
						<Card>
							<CardHeader>
								<CardTitle class="text-base">История расчётов</CardTitle>
							</CardHeader>
							<CardContent>
								{#await loadIOLHistory() then}
									<IOLHistory calculations={iolHistory} />
								{/await}
							</CardContent>
						</Card>
					</div>
				</Tabs.Content>

				<Tabs.Content value="comments">
					<div class="flex flex-col gap-6">
						<CommentForm {patientId} oncommented={loadComments} />
						<Separator />
						<CommentThread {comments} {patientId} onrefresh={loadComments} />
					</div>
				</Tabs.Content>
			</div>
		</Tabs.Root>

		{#if showStatusDialog}
			<ChangeStatusDialog
				{patientId}
				currentStatus={patient.status}
				open={showStatusDialog}
				onclose={() => (showStatusDialog = false)}
				onstatusChanged={() => patientStore.fetchPatient(patientId)}
			/>
		{/if}
	{:else if patientStore.error}
		<p class="text-destructive">{patientStore.error}</p>
	{/if}
</div>
