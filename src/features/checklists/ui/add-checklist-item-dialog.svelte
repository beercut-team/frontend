<script lang="ts">
	import { apiCreateChecklistItem } from '@/shared/api';
	import type { CreateChecklistItemRequest } from '@/shared/api/types';
	import { Button } from '@/shared/ui/button';
	import { Input } from '@/shared/ui/input';
	import { Label } from '@/shared/ui/label';
	import { Textarea } from '@/shared/ui/textarea';
	import { Checkbox } from '@/shared/ui/checkbox';
	import {
		Dialog,
		DialogContent,
		DialogDescription,
		DialogFooter,
		DialogHeader,
		DialogTitle,
		DialogTrigger,
	} from '@/shared/ui/dialog';
	import { Plus } from 'lucide-svelte';

	let {
		patientId,
		onSuccess,
	}: {
		patientId: number;
		onSuccess: () => void;
	} = $props();

	let open = $state(false);
	let isSaving = $state(false);
	let name = $state('');
	let description = $state('');
	let category = $state('');
	let isRequired = $state(false);
	let expiresInDays = $state<number | undefined>(undefined);

	function reset() {
		name = '';
		description = '';
		category = '';
		isRequired = false;
		expiresInDays = undefined;
	}

	async function handleSubmit() {
		if (!name.trim()) return;

		isSaving = true;
		try {
			const data: CreateChecklistItemRequest = {
				patient_id: patientId,
				name: name.trim(),
				description: description.trim() || undefined,
				category: category.trim() || undefined,
				is_required: isRequired,
				expires_in_days: expiresInDays,
			};

			await apiCreateChecklistItem(data);
			reset();
			open = false;
			onSuccess();
		} catch (error) {
			console.error('Failed to create checklist item:', error);
		} finally {
			isSaving = false;
		}
	}
</script>

<Dialog bind:open>
	<DialogTrigger asChild let:builder>
		<Button builders={[builder]} size="sm" class="gap-2">
			<Plus class="h-4 w-4" />
			Добавить пункт
		</Button>
	</DialogTrigger>
	<DialogContent class="sm:max-w-[500px]">
		<DialogHeader>
			<DialogTitle>Добавить пункт в чек-лист</DialogTitle>
			<DialogDescription>
				Добавьте дополнительное обследование или документ для пациента
			</DialogDescription>
		</DialogHeader>
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-4">
			<div class="flex flex-col gap-2">
				<Label for="name">Название *</Label>
				<Input
					id="name"
					bind:value={name}
					placeholder="Консультация кардиолога"
					required
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="description">Описание</Label>
				<Textarea
					id="description"
					bind:value={description}
					placeholder="При наличии гипертонии или ИБС"
					rows={2}
				/>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="category">Категория</Label>
				<Input
					id="category"
					bind:value={category}
					placeholder="Заключения"
				/>
			</div>

			<div class="flex items-center gap-2">
				<Checkbox id="required" bind:checked={isRequired} />
				<Label for="required" class="cursor-pointer font-normal">
					Обязательный пункт
				</Label>
			</div>

			<div class="flex flex-col gap-2">
				<Label for="expires">Срок действия (дней)</Label>
				<Input
					id="expires"
					type="number"
					bind:value={expiresInDays}
					placeholder="30"
					min="1"
				/>
			</div>

			<DialogFooter>
				<Button type="button" variant="outline" onclick={() => { open = false; }}>
					Отмена
				</Button>
				<Button type="submit" disabled={isSaving || !name.trim()}>
					{isSaving ? 'Сохранение...' : 'Добавить'}
				</Button>
			</DialogFooter>
		</form>
	</DialogContent>
</Dialog>
