<script lang="ts">
	import type { IOLCalculation } from '@/shared/api';
	import { Eye } from '@/shared/api/types';
	import { Card, CardContent, CardHeader, CardTitle } from '@/shared/ui/card';

	let { result }: { result: IOLCalculation } = $props();
</script>

<Card class="border-primary/50">
	<CardHeader>
		<CardTitle class="text-base">Результат расчёта ИОЛ</CardTitle>
	</CardHeader>
	<CardContent>
		<div class="grid grid-cols-2 gap-4 text-sm">
			<div>
				<span class="text-muted-foreground">Глаз</span>
				<p class="font-medium">{result.eye === Eye.OS ? 'Левый (OS)' : result.eye === Eye.OD ? 'Правый (OD)' : 'Оба (OU)'}</p>
			</div>
			<div>
				<span class="text-muted-foreground">Формула</span>
				<p class="font-medium">{result.formula}</p>
			</div>
			<div>
				<span class="text-muted-foreground">Рекомендуемая сила ИОЛ</span>
				<p class="text-lg font-bold text-primary">{result.iol_power.toFixed(1)} D</p>
			</div>
			<div>
				<span class="text-muted-foreground">Прогнозируемая рефракция</span>
				<p class="text-lg font-bold">{result.predicted_refraction.toFixed(2)} D</p>
			</div>
		</div>
	</CardContent>
</Card>
