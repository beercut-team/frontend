<script lang="ts">
	import { page } from '$app/stores';
	import SurgeryDetailPage from '@/pages/surgeries/ui/surgery-detail-page.svelte';

	const surgeryId = $derived(Number($page.params.id));
</script>

<SurgeryDetailPage {surgeryId} />
