<script lang="ts">
	import { fly, fade, scale, blur } from 'svelte/transition';
	import { cubicOut, quintOut, backOut } from 'svelte/easing';
	import { inview } from '@/shared/hooks/inview';

	const members = [
		{
			name: 'Свинобоев Артем',
			role: 'Менеджер',
			initials: 'СА',
			emoji: '📋',
			color: 'from-amber-500/20 to-orange-500/20',
			accent: 'text-amber-600 dark:text-amber-400',
			ring: 'ring-amber-500/30 group-hover:ring-amber-500/60',
			badge: 'bg-amber-500/10 text-amber-700 dark:text-amber-300',
			bio: 'Организует процессы, следит за сроками и держит команду в тонусе. Отвечает за стратегию и коммуникацию с заказчиком.',
			quote: '«Хороший план сегодня лучше идеального плана завтра»',
			skills: ['Управление проектами', 'Agile / Scrum', 'Аналитика', 'Коммуникация'],
		},
		{
			name: 'Попов Айтал',
			role: 'Дизайнер',
			initials: 'ПА',
			emoji: '🎨',
			color: 'from-violet-500/20 to-purple-500/20',
			accent: 'text-violet-600 dark:text-violet-400',
			ring: 'ring-violet-500/30 group-hover:ring-violet-500/60',
			badge: 'bg-violet-500/10 text-violet-700 dark:text-violet-300',
			bio: 'Создаёт интуитивные интерфейсы и продуманный визуал. Превращает идеи в пиксель-перфектные макеты.',
			quote: '«Дизайн — это не как выглядит, а как работает»',
			skills: ['UI/UX', 'Figma', 'Прототипирование', 'Типографика'],
		},
		{
			name: 'Чичигинаров Остап',
			role: 'Разработчик',
			initials: 'ЧО',
			emoji: '💻',
			color: 'from-emerald-500/20 to-teal-500/20',
			accent: 'text-emerald-600 dark:text-emerald-400',
			ring: 'ring-emerald-500/30 group-hover:ring-emerald-500/60',
			badge: 'bg-emerald-500/10 text-emerald-700 dark:text-emerald-300',
			bio: 'Пишет чистый, производительный код. Архитектор фронтенда, превращающий дизайн в живой продукт.',
			quote: '«Лучший код — тот, который не нужно писать»',
			skills: ['SvelteKit', 'TypeScript', 'Tailwind CSS', 'Docker'],
		},
	];

	const stats = [
		{ value: '3', label: 'Участника', icon: '👥' },
		{ value: '1', label: 'Цель', icon: '🎯' },
		{ value: '∞', label: 'Энергии', icon: '⚡' },
	];

	let teamVisible = $state(false);
	let statsVisible = $state(false);
	let detailsVisible = $state<boolean[]>(members.map(() => false));
	let ctaVisible = $state(false);

	let mouseX = $state(0);
	let mouseY = $state(0);

	function handleMouseMove(e: MouseEvent) {
		mouseX = (e.clientX / window.innerWidth - 0.5) * 20;
		mouseY = (e.clientY / window.innerHeight - 0.5) * 20;
	}
</script>

<svelte:window onmousemove={handleMouseMove} />

<!-- Hero -->
<section class="relative flex min-h-[90vh] flex-col items-center justify-center overflow-hidden px-6 text-center">
	<!-- Animated background orbs -->
	<div
		class="pointer-events-none absolute inset-0 overflow-hidden"
	>
		<div
			class="absolute -top-1/4 left-1/4 h-[600px] w-[600px] rounded-full bg-primary/5 blur-[120px] transition-transform duration-1000 ease-out"
			style="transform: translate({mouseX * 0.5}px, {mouseY * 0.5}px)"
		></div>
		<div
			class="absolute -bottom-1/4 right-1/4 h-[500px] w-[500px] rounded-full bg-accent/10 blur-[100px] transition-transform duration-1000 ease-out"
			style="transform: translate({mouseX * -0.3}px, {mouseY * -0.3}px)"
		></div>
		<div
			class="absolute left-1/2 top-1/2 h-[400px] w-[400px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-muted/50 blur-[80px]"
		></div>
	</div>

	<!-- Grid pattern -->
	<div class="pointer-events-none absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.03]"></div>

	<div
		in:scale={{ start: 0.9, duration: 500, delay: 0, easing: cubicOut }}
	>
		<span
			in:fly={{ y: -20, duration: 600, delay: 100, easing: cubicOut }}
			class="relative mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-5 py-2 text-sm font-medium text-muted-foreground shadow-sm backdrop-blur-md"
		>
			<span class="relative flex h-2 w-2">
				<span class="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
				<span class="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
			</span>
			Peak IT 2026
		</span>
	</div>

	<h1
		in:blur={{ amount: 15, duration: 900, delay: 200, easing: cubicOut }}
		class="relative text-7xl font-black tracking-tighter sm:text-9xl"
	>
		<span class="bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
			Beercut
		</span>
	</h1>

	<p
		in:fly={{ y: 30, duration: 700, delay: 450, easing: cubicOut }}
		class="relative mt-8 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl"
	>
		Три человека. Одна цель. Мы превращаем идеи
		в продукты, которые работают.
	</p>

	<div
		in:fly={{ y: 20, duration: 600, delay: 650, easing: cubicOut }}
		class="relative mt-12 flex flex-col items-center gap-4 sm:flex-row"
	>
		<a
			href="#team"
			class="group inline-flex items-center gap-2.5 rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-primary/30 active:scale-95"
		>
			Познакомиться с командой
			<span class="inline-block transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
		</a>
	</div>

	<!-- Scroll indicator -->
	<div
		in:fade={{ duration: 800, delay: 1200 }}
		class="absolute bottom-8 left-1/2 -translate-x-1/2"
	>
		<div class="flex h-8 w-5 items-start justify-center rounded-full border-2 border-muted-foreground/30 p-1">
			<div class="h-1.5 w-1 animate-bounce rounded-full bg-muted-foreground/50"></div>
		</div>
	</div>
</section>

<!-- Stats -->
<section
	class="relative border-y border-border bg-muted/30 px-6 py-20"
	use:inview={() => (statsVisible = true)}
>
	{#if statsVisible}
		<div class="mx-auto grid max-w-4xl grid-cols-3 gap-8 text-center">
			{#each stats as stat, i}
				<div
					in:fly={{ y: 40, duration: 700, delay: i * 150, easing: backOut }}
					class="flex flex-col items-center gap-3"
				>
					<span
						in:scale={{ start: 0, duration: 500, delay: 200 + i * 150, easing: backOut }}
						class="text-4xl"
					>
						{stat.icon}
					</span>
					<p class="text-5xl font-black tracking-tight sm:text-6xl">{stat.value}</p>
					<p class="text-sm font-medium uppercase tracking-widest text-muted-foreground">{stat.label}</p>
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- Team Cards -->
<section
	id="team"
	class="relative mx-auto w-full max-w-6xl px-6 py-32 scroll-mt-16"
	use:inview={() => (teamVisible = true)}
>
	{#if teamVisible}
		<div class="mb-16 text-center">
			<p
				in:fade={{ duration: 400 }}
				class="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-primary/60"
			>
				Кто мы
			</p>
			<h2
				in:blur={{ amount: 10, duration: 600, delay: 100, easing: cubicOut }}
				class="text-4xl font-black tracking-tight sm:text-6xl"
			>
				Наша команда
			</h2>
			<p
				in:fly={{ y: 15, duration: 500, delay: 250, easing: cubicOut }}
				class="mx-auto mt-4 max-w-md text-muted-foreground"
			>
				Каждый из нас отвечает за свою зону — вместе мы закрываем весь цикл разработки
			</p>
		</div>

		<div class="grid gap-8 sm:grid-cols-3">
			{#each members as member, i}
				<div
					in:fly={{ y: 80, duration: 800, delay: 300 + i * 180, easing: quintOut }}
					class="group relative flex flex-col items-center gap-6 overflow-hidden rounded-3xl border border-border bg-card p-10 text-center transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
				>
					<!-- Card gradient bg -->
					<div class="pointer-events-none absolute inset-0 bg-gradient-to-br {member.color} opacity-0 transition-opacity duration-500 group-hover:opacity-100"></div>

					<div
						in:scale={{ start: 0, duration: 600, delay: 550 + i * 180, easing: backOut }}
						class="relative flex h-24 w-24 items-center justify-center rounded-2xl bg-primary text-3xl font-bold text-primary-foreground ring-4 {member.ring} transition-all duration-500"
					>
						{member.initials}
					</div>

					<span
						in:scale={{ start: 0, duration: 400, delay: 700 + i * 180, easing: backOut }}
						class="relative text-4xl"
					>
						{member.emoji}
					</span>

					<div class="relative">
						<p class="text-xl font-bold">{member.name}</p>
						<p class="mt-1 text-sm font-semibold {member.accent}">{member.role}</p>
					</div>

					<p class="relative text-sm leading-relaxed text-muted-foreground">{member.bio}</p>

					<div class="relative mt-auto flex flex-wrap justify-center gap-2 pt-2">
						{#each member.skills as skill}
							<span class="rounded-full {member.badge} px-3 py-1 text-xs font-medium transition-transform duration-200 group-hover:scale-105">
								{skill}
							</span>
						{/each}
					</div>
				</div>
			{/each}
		</div>
	{/if}
</section>

<!-- Detailed Sections -->
{#each members as member, i}
	<section
		class="relative overflow-hidden border-t border-border {i % 2 === 1 ? 'bg-muted/20' : ''}"
		use:inview={() => (detailsVisible[i] = true)}
	>
		{#if detailsVisible[i]}
			<div class="mx-auto grid max-w-6xl items-center gap-16 px-6 py-28 sm:grid-cols-2">
				<div
					class="flex flex-col {i % 2 === 1 ? 'sm:order-2' : ''}"
					in:fly={{ x: i % 2 === 0 ? -80 : 80, duration: 800, easing: quintOut }}
				>
					<span
						in:scale={{ start: 0, duration: 500, delay: 200, easing: backOut }}
						class="mb-4 w-fit rounded-full {member.badge} px-4 py-1.5 text-sm font-semibold"
					>
						{member.emoji} {member.role}
					</span>

					<h3
						in:fly={{ y: 20, duration: 600, delay: 150, easing: cubicOut }}
						class="text-4xl font-black tracking-tight"
					>
						{member.name}
					</h3>

					<p
						in:fly={{ y: 20, duration: 600, delay: 250, easing: cubicOut }}
						class="mt-5 text-lg leading-relaxed text-muted-foreground"
					>
						{member.bio}
					</p>

					<blockquote
						in:fly={{ y: 20, duration: 600, delay: 350, easing: cubicOut }}
						class="mt-6 border-l-2 border-primary/30 pl-4 text-sm italic text-muted-foreground/80"
					>
						{member.quote}
					</blockquote>

					<div class="mt-8 flex flex-wrap gap-2.5">
						{#each member.skills as skill, j}
							<span
								in:fly={{ y: 20, duration: 500, delay: 400 + j * 80, easing: cubicOut }}
								class="rounded-xl {member.badge} px-4 py-2 text-sm font-semibold shadow-sm"
							>
								{skill}
							</span>
						{/each}
					</div>
				</div>

				<div
					class="flex items-center justify-center {i % 2 === 1 ? 'sm:order-1' : ''}"
					in:scale={{ start: 0.6, duration: 800, delay: 200, easing: backOut }}
				>
					<div class="relative">
						<!-- Glow -->
						<div class="absolute inset-0 rounded-[2rem] bg-gradient-to-br {member.color} blur-2xl transition-all duration-500"></div>

						<div class="relative flex h-56 w-56 items-center justify-center rounded-[2rem] border border-border bg-card text-8xl shadow-2xl transition-all duration-500 hover:rotate-3 hover:scale-110 sm:h-64 sm:w-64">
							{member.emoji}
						</div>
					</div>
				</div>
			</div>
		{/if}
	</section>
{/each}

<!-- CTA -->
<section
	class="relative overflow-hidden border-t border-border px-6 py-32"
	use:inview={() => (ctaVisible = true)}
>
	{#if ctaVisible}
		<div class="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,var(--primary)_0%,transparent_70%)] opacity-[0.04]"></div>

		<div class="relative mx-auto max-w-2xl text-center">
			<span
				in:scale={{ start: 0, duration: 500, easing: backOut }}
				class="mb-6 inline-block text-6xl"
			>
				🏆
			</span>
			<h2
				in:blur={{ amount: 12, duration: 800, delay: 150, easing: cubicOut }}
				class="text-4xl font-black tracking-tight sm:text-6xl"
			>
				Готовы к победе
			</h2>
			<p
				in:fly={{ y: 25, duration: 600, delay: 350, easing: cubicOut }}
				class="mt-6 text-lg leading-relaxed text-muted-foreground"
			>
				PEAK IT 2026 — наш шанс показать, на что мы способны.
				Следите за прогрессом.
			</p>
		</div>
	{/if}
</section>
