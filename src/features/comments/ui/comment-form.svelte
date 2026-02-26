<script lang="ts">
	import { apiCreateComment } from '@/shared/api';
	import { Button } from '@/shared/ui/button';
	import { Textarea } from '@/shared/ui/textarea';
	import { Checkbox } from '@/shared/ui/checkbox';
	import { Label } from '@/shared/ui/label';

	let {
		patientId,
		oncommented,
	}: {
		patientId: number;
		oncommented: () => void;
	} = $props();

	let body = $state('');
	let isUrgent = $state(false);
	let isSubmitting = $state(false);
	let error = $state('');

	async function submit() {
		if (!body.trim()) return;
		isSubmitting = true;
		error = '';

		// Ensure patient_id is a number
		const numericPatientId = typeof patientId === 'string' ? parseInt(patientId, 10) : patientId;

		console.log('🔍 Creating comment:', {
			patient_id: numericPatientId,
			patient_id_type: typeof numericPatientId,
			body: body.trim(),
			body_length: body.trim().length,
			is_urgent: isUrgent
		});

		try {
			await apiCreateComment({
				patient_id: numericPatientId,
				body: body.trim(),
				is_urgent: isUrgent
			});
			body = '';
			isUrgent = false;
			oncommented();
		} catch (e: any) {
			console.error('❌ Comment creation failed:', e);
			console.error('Response data:', e.response?.data);
			error = e.response?.data?.detail || e.response?.data?.message || e.message || 'Ошибка отправки';
		} finally {
			isSubmitting = false;
		}
	}
</script>

<div class="flex flex-col gap-3">
	{#if error}
		<div class="rounded-md border border-destructive/50 bg-destructive/10 p-3">
			<p class="text-sm font-medium text-destructive">Ошибка отправки</p>
			<p class="text-xs text-destructive/80 mt-1">{error}</p>
		</div>
	{/if}
	<Textarea bind:value={body} placeholder="Написать комментарий..." rows={3} />
	<div class="flex items-center justify-between">
		<div class="flex items-center gap-4">
			<div class="flex items-center gap-2">
				<Checkbox bind:checked={isUrgent} id="urgent" />
				<Label for="urgent" class="text-sm">Срочное</Label>
			</div>
			<div class="text-xs text-muted-foreground">
				{body.length} / 1000 символов
			</div>
		</div>
		<Button size="sm" onclick={submit} disabled={!body.trim() || isSubmitting}>
			{isSubmitting ? 'Отправка...' : 'Отправить'}
		</Button>
	</div>
</div>
