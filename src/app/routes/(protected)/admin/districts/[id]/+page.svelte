<script lang="ts">
	import { page } from '$app/stores';
	import DistrictsPage from '@/pages/admin/ui/districts-page.svelte';

	const districtId = $derived(Number($page.params.id));
</script>

<DistrictsPage editDistrictId={districtId} />
