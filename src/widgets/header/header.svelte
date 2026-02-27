<script lang="ts">
	import { Button } from '@/shared/ui/button';
	import { authStore } from '@/entities/user';
	import { UserRole } from '@/shared/api/types';
	import NotificationBell from '@/features/notifications/ui/notification-bell.svelte';
	import { ThemeToggle } from '@/features/theme-toggle';
	import { AccessibilityToggle } from '@/features/accessibility';

	let mobileMenuOpen = $state(false);

	const roleNavLinks: Record<string, { href: string; label: string }[]> = {
		[UserRole.ADMIN]: [
			{ href: '/patients', label: 'Пациенты' },
			{ href: '/admin/districts', label: 'Районы' },
		],
		[UserRole.SURGEON]: [
			{ href: '/patients', label: 'Пациенты' },
			{ href: '/surgeries', label: 'Операции' },
		],
		[UserRole.DISTRICT_DOCTOR]: [
			{ href: '/patients', label: 'Пациенты' },
		],
		[UserRole.PATIENT]: [
			{ href: '/dashboard', label: 'Мой статус' },
		],
	};

	const navLinks = $derived(
		authStore.user ? roleNavLinks[authStore.user.role] ?? [] : []
	);

	const displayName = $derived(
		authStore.user
			? authStore.user.first_name && authStore.user.last_name
				? `${authStore.user.first_name} ${authStore.user.last_name}`
				: authStore.user.name
			: ''
	);
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6">
		<!-- Logo -->
		<a
			href={authStore.isAuthenticated ? '/dashboard' : '/'}
			class="text-lg font-bold tracking-tight sm:text-xl"
		>
			Oculus-Feldsher
		</a>


		<!-- Right Side Actions -->
		<div class="flex items-center gap-1 sm:gap-2">
			<!-- Theme & Accessibility Toggles -->
			<ThemeToggle />
			<AccessibilityToggle />

			{#if authStore.isAuthenticated && authStore.user}
				<NotificationBell />
				<span class="hidden text-sm text-muted-foreground lg:inline">{displayName}</span>
				<Button variant="ghost" href="/profile" class="hidden sm:inline-flex">Профиль</Button>
				<Button variant="outline" size="sm" onclick={() => authStore.logout()} class="hidden sm:inline-flex">
					Выйти
				</Button>
			{:else}
				<Button variant="ghost" href="/login" class="hidden sm:inline-flex">Войти</Button>
				<Button href="/register" class="hidden sm:inline-flex">Регистрация</Button>
			{/if}

			<!-- Mobile Menu Button -->
			<Button
				variant="ghost"
				size="icon"
				onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
				aria-label="Меню"
				class="md:hidden"
			>
				{#if mobileMenuOpen}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<path d="M18 6 6 18" />
						<path d="m6 6 12 12" />
					</svg>
				{:else}
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="24"
						height="24"
						viewBox="0 0 24 24"
						fill="none"
						stroke="currentColor"
						stroke-width="2"
						stroke-linecap="round"
						stroke-linejoin="round"
					>
						<line x1="4" x2="20" y1="12" y2="12" />
						<line x1="4" x2="20" y1="6" y2="6" />
						<line x1="4" x2="20" y1="18" y2="18" />
					</svg>
				{/if}
			</Button>
		</div>
	</div>

	<!-- Mobile Menu -->
	{#if mobileMenuOpen}
		<div class="border-t border-border bg-background md:hidden">
			<nav class="mx-auto flex max-w-6xl flex-col gap-1 px-4 py-4">
				{#if !authStore.isAuthenticated}
					<a
						href="/#team"
						class="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						onclick={() => (mobileMenuOpen = false)}
					>
						Команда
					</a>
				{/if}
				{#each navLinks as link}
					<a
						href={link.href}
						class="rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
						onclick={() => (mobileMenuOpen = false)}
					>
						{link.label}
					</a>
				{/each}

				<div class="mt-2 flex flex-col gap-2 border-t border-border pt-4">
					{#if authStore.isAuthenticated && authStore.user}
						<div class="px-3 py-1 text-sm text-muted-foreground">{displayName}</div>
						<Button variant="ghost" href="/profile" class="justify-start sm:hidden">Профиль</Button>
						<Button
							variant="outline"
							size="sm"
							onclick={() => {
								authStore.logout();
								mobileMenuOpen = false;
							}}
							class="sm:hidden"
						>
							Выйти
						</Button>
					{:else}
						<Button variant="ghost" href="/login" class="justify-start sm:hidden">Войти</Button>
						<Button href="/register" class="sm:hidden">Регистрация</Button>
					{/if}
				</div>
			</nav>
		</div>
	{/if}
</header>
