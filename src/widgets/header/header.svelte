<script lang="ts">
	import { Button } from '@/shared/ui/button';
</script>

<header
	class="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
		<a href="/" class="text-xl font-bold tracking-tight">Beercut</a>

		<nav class="flex items-center gap-6 text-sm">
			<a href="/#team" class="text-muted-foreground transition-colors hover:text-foreground">
				Команда
			</a>
		</nav>

		<div class="flex items-center gap-2">
			<Button variant="ghost" href="/login">Войти</Button>
			<Button href="/register">Регистрация</Button>
		</div>
	</div>
</header>
