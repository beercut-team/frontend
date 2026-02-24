<script lang="ts">
	const members = [
		{
			name: 'Остап Чичигинаров',
			role: 'Разработчик',
			initials: 'ОЧ',
		},
		{
			name: 'Артемчик Свинобоев',
			role: 'Разработчик',
			initials: 'АС',
		},
		{
			name: 'Айтал Попов',
			role: 'Разработчик',
			initials: 'АП',
		},
	];
</script>

<!-- Hero -->
<section class="flex flex-col items-center justify-center px-6 py-28 text-center">
	<span class="mb-4 rounded-full border border-border px-4 py-1 text-sm text-muted-foreground">
		Peak IT 2026
	</span>
	<h1 class="text-6xl font-extrabold tracking-tight sm:text-7xl">Beercut</h1>
	<p class="mt-6 max-w-xl text-lg text-muted-foreground">
		Мы команда разработчиков, создающих крутые продукты. Добро пожаловать на нашу страницу.
	</p>
</section>

<!-- Team -->
<section id="team" class="mx-auto w-full max-w-6xl px-6 pb-28">
	<h2 class="mb-10 text-center text-3xl font-bold tracking-tight">Команда</h2>
	<div class="grid gap-6 sm:grid-cols-3">
		{#each members as member}
			<div
				class="flex flex-col items-center gap-4 rounded-xl border border-border bg-card p-8 text-center shadow-sm"
			>
				<div
					class="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-xl font-bold text-primary-foreground"
				>
					{member.initials}
				</div>
				<div>
					<p class="font-semibold">{member.name}</p>
					<p class="mt-1 text-sm text-muted-foreground">{member.role}</p>
				</div>
			</div>
		{/each}
	</div>
</section>
