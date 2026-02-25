<script lang="ts">
	import { page } from '$app/stores';
	import PatientStatusPage from '@/pages/patient-status/ui/patient-status-page.svelte';

	const code = $derived($page.params.code ?? '');
</script>

<PatientStatusPage {code} />
