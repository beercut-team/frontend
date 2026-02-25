<script lang="ts">
	import { Button } from '@/shared/ui/button';
	import * as Dialog from '@/shared/ui/dialog';
	import { accessibilityStore } from '../model/accessibility-store';
	import type { FontSize, ColorScheme } from '../model/accessibility-store';

	let isOpen = $state(false);
	const settings = $derived($accessibilityStore);

	const fontSizeLabels: Record<FontSize, string> = {
		small: 'Мелкий',
		medium: 'Средний',
		large: 'Крупный',
	};

	const colorSchemeLabels: Record<ColorScheme, string> = {
		default: 'Обычная',
		'black-white': 'Черным по белому',
		'white-black': 'Белым по черному',
		'blue-white': 'Синим по белому',
	};
</script>

<Button
	variant="ghost"
	size="icon"
	onclick={() => (isOpen = true)}
	aria-label="Настройки для слабовидящих"
	class="h-9 w-9"
>
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width="20"
		height="20"
		viewBox="0 0 24 24"
		fill="none"
		stroke="currentColor"
		stroke-width="2"
		stroke-linecap="round"
		stroke-linejoin="round"
		class={settings.isEnabled ? 'text-primary' : ''}
		aria-hidden="true"
	>
		<circle cx="12" cy="12" r="10" />
		<circle cx="12" cy="10" r="3" />
		<path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662" />
	</svg>
</Button>

<Dialog.Root bind:open={isOpen}>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Версия для слабовидящих</Dialog.Title>
			<Dialog.Description>
				Настройте размер шрифта и цветовую схему для удобного чтения
			</Dialog.Description>
		</Dialog.Header>

		<div class="space-y-4 py-4">
			<div>
				<div class="mb-2 text-sm font-medium">Размер шрифта</div>
				<div class="grid grid-cols-3 gap-2">
					{#each ['small', 'medium', 'large'] as size}
						<Button
							variant={settings.fontSize === size ? 'default' : 'outline'}
							size="sm"
							onclick={() => accessibilityStore.setFontSize(size as FontSize)}
							aria-label={`Установить ${fontSizeLabels[size as FontSize]} размер шрифта`}
							aria-pressed={settings.fontSize === size}
						>
							{fontSizeLabels[size as FontSize]}
						</Button>
					{/each}
				</div>
			</div>

			<div>
				<div class="mb-2 text-sm font-medium">Цветовая схема</div>
				<div class="flex flex-col gap-2">
					{#each ['default', 'black-white', 'white-black', 'blue-white'] as scheme}
						<Button
							variant={settings.colorScheme === scheme ? 'default' : 'outline'}
							size="sm"
							class="justify-start"
							onclick={() => accessibilityStore.setColorScheme(scheme as ColorScheme)}
							aria-label={`Установить цветовую схему: ${colorSchemeLabels[scheme as ColorScheme]}`}
							aria-pressed={settings.colorScheme === scheme}
						>
							{colorSchemeLabels[scheme as ColorScheme]}
						</Button>
					{/each}
				</div>
			</div>
		</div>

		<Dialog.Footer class="flex gap-2">
			<Button
				variant="outline"
				class="flex-1"
				onclick={() => accessibilityStore.toggle()}
				aria-label={settings.isEnabled ? 'Отключить специальные возможности' : 'Включить специальные возможности'}
			>
				{settings.isEnabled ? 'Отключить' : 'Включить'}
			</Button>
			<Button
				variant="ghost"
				class="flex-1"
				onclick={() => accessibilityStore.reset()}
				aria-label="Сбросить настройки"
			>
				Сбросить
			</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>
