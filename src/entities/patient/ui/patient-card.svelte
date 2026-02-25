<script lang="ts">
	import type { Patient } from '@/shared/api';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import PatientStatusBadge from './patient-status-badge.svelte';

	let { patient, onclick }: { patient: Patient; onclick?: () => void } = $props();

	const fullName = $derived(
		[patient.last_name, patient.first_name, patient.middle_name].filter(Boolean).join(' ')
	);
</script>

<Card
	class="cursor-pointer transition-shadow hover:shadow-md {onclick ? 'hover:border-primary/50' : ''}"
	onclick={onclick}
>
	<CardHeader class="pb-2">
		<div class="flex items-start justify-between">
			<CardTitle class="text-base">{fullName}</CardTitle>
			<PatientStatusBadge status={patient.status} />
		</div>
	</CardHeader>
	<CardContent>
		<div class="flex flex-col gap-1 text-sm text-muted-foreground">
			<span>Дата рождения: {new Date(patient.date_of_birth).toLocaleDateString('ru-RU')}</span>
			{#if patient.diagnosis}
				<span>Диагноз: {patient.diagnosis}</span>
			{/if}
			{#if patient.district}
				<span>Район: {patient.district.name}</span>
			{/if}
		</div>
	</CardContent>
</Card>
