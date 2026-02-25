<script lang="ts">
	import { PatientForm } from '@/features/patients';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';
	import { apiCreatePatient } from '@/shared/api';
	import { goto } from '$app/navigation';

	let isSubmitting = $state(false);

	async function handleSubmit(data: any) {
		isSubmitting = true;
		try {
			const { data: res } = await apiCreatePatient(data);
			await goto(`/patients/${res.data.id}`);
		} finally {
			isSubmitting = false;
		}
	}
</script>

<svelte:head>
	<title>Новый пациент — Oculus-Feldsher</title>
</svelte:head>

<div class="mx-auto max-w-3xl px-6 py-8">
	<div class="mb-6">
		<h1 class="text-2xl font-bold">Новый пациент</h1>
		<p class="text-muted-foreground">Заполните данные для регистрации пациента</p>
	</div>

	<Card>
		<CardHeader>
			<CardTitle>Данные пациента</CardTitle>
		</CardHeader>
		<CardContent>
			<PatientForm onsubmit={handleSubmit} {isSubmitting} />
		</CardContent>
	</Card>
</div>
