<script lang="ts">
	import type { IOLCalculation } from '@/shared/api';
	import { Eye } from '@/shared/api/types';
	import * as Table from '@/shared/ui/table';

	let { calculations }: { calculations: IOLCalculation[] } = $props();
</script>

{#if calculations.length === 0}
	<p class="text-sm text-muted-foreground">Нет предыдущих расчётов</p>
{:else}
	<Table.Root>
		<Table.Header>
			<Table.Row>
				<Table.Head>Дата</Table.Head>
				<Table.Head>Глаз</Table.Head>
				<Table.Head>Формула</Table.Head>
				<Table.Head>AL</Table.Head>
				<Table.Head>K1/K2</Table.Head>
				<Table.Head>ИОЛ</Table.Head>
				<Table.Head>Рефракция</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each calculations as calc}
				<Table.Row>
					<Table.Cell>{new Date(calc.created_at).toLocaleDateString('ru-RU')}</Table.Cell>
					<Table.Cell>{calc.eye === Eye.OS ? 'OS' : calc.eye === Eye.OD ? 'OD' : 'OU'}</Table.Cell>
					<Table.Cell>{calc.formula}</Table.Cell>
					<Table.Cell>{calc.axial_length}</Table.Cell>
					<Table.Cell>{calc.keratometry_k1}/{calc.keratometry_k2}</Table.Cell>
					<Table.Cell class="font-medium">{calc.recommended_iol_power.toFixed(1)}</Table.Cell>
					<Table.Cell>{calc.predicted_refraction.toFixed(2)}</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
{/if}
