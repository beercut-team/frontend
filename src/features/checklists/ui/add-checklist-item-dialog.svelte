<script lang="ts">
	import { apiCreateChecklistItem } from '@/shared/api';
	import type { CreateChecklistItemRequest } from '@/shared/api/types';
	import { Button } from '@/shared/ui/button';
	import { Input } from '@/shared/ui/input';
	import { Label } from '@/shared/ui/label';
	import { Textarea } from '@/shared/ui/textarea';
	import { Checkbox } from '@/shared/ui/checkbox';
	import * as Dialog from '@/shared/ui/dialog';
	import { Plus } from '@lucide/svelte';

	let {
		patientId,
		onSuccess,
	}: {
		patientId: number;
		onSuccess: () => void;
	} = $props();

	let open = $state(false);
	let isSaving = $state(false);
	let error = $state<string | null>(null);
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
		error = null;
	}

	async function handleSubmit() {
		if (!name.trim()) return;

		isSaving = true;
		error = null;
		try {
			const data: CreateChecklistItemRequest = {
				patient_id: patientId,
				name: name.trim(),
				description: description.trim() || undefined,
				category: category.trim() || undefined,
				is_required: isRequired,
				expires_in_days: expiresInDays,
			};

			const response = await apiCreateChecklistItem(data);
			console.log('Checklist item created:', response);
			reset();
			open = false;
			onSuccess();
		} catch (err: any) {
			console.error('Failed to create checklist item:', err);
			error = err?.response?.data?.error || err?.message || 'Не удалось создать пункт чек-листа';
		} finally {
			isSaving = false;
		}
	}
</script>

<Dialog.Root bind:open>
	<Dialog.Trigger>
		<Button size="sm" class="gap-2">
			<Plus class="h-4 w-4" />
			Добавить пункт
		</Button>
	</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-[500px]">
		<Dialog.Header>
			<Dialog.Title>Добавить пункт в чек-лист</Dialog.Title>
			<Dialog.Description>
				Добавьте дополнительное обследование или документ для пациента
			</Dialog.Description>
		</Dialog.Header>
		<form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }} class="flex flex-col gap-4">
			{#if error}
				<div class="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
					{error}
				</div>
			{/if}

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

			<Dialog.Footer>
				<Button type="button" variant="outline" onclick={() => { open = false; }}>
					Отмена
				</Button>
				<Button type="submit" disabled={isSaving || !name.trim()}>
					{isSaving ? 'Сохранение...' : 'Добавить'}
				</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>
