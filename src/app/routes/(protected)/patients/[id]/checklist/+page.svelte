<script lang="ts">
	import { page } from '$app/stores';
	import PatientDetailPage from '@/pages/patients/ui/patient-detail-page.svelte';

	const patientId = $derived(Number($page.params.id));
</script>

<PatientDetailPage {patientId} initialTab="checklist" />
