<script lang="ts">
	import { authStore } from '@/entities/user';
	import { Button } from '@/shared/ui/button';
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle,
	} from '@/shared/ui/card';
	import { Separator } from '@/shared/ui/separator';
</script>

<div class="flex min-h-[calc(100vh-8rem)] items-center justify-center px-4 py-12">
	<div class="w-full max-w-md">
		<Card>
			<CardHeader>
				<CardTitle>Профиль</CardTitle>
				<CardDescription>Информация о вашем аккаунте</CardDescription>
			</CardHeader>

			<CardContent class="flex flex-col gap-4">
				{#if authStore.user}
					<div class="flex flex-col gap-1">
						<span class="text-sm text-muted-foreground">Имя</span>
						<span class="text-base font-medium">{authStore.user.name}</span>
					</div>

					<div class="flex flex-col gap-1">
						<span class="text-sm text-muted-foreground">Email</span>
						<span class="text-base font-medium">{authStore.user.email}</span>
					</div>

					<Separator />

					<Button variant="destructive" onclick={() => authStore.logout()}>
						Выйти из аккаунта
					</Button>
				{/if}
			</CardContent>
		</Card>
	</div>
</div>
