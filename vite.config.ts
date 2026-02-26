import tailwindcss from "@tailwindcss/vite"
import { sveltekit } from "@sveltejs/kit/vite"
import { defineConfig } from "vite"
import { SvelteKitPWA } from "@vite-pwa/sveltekit"

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			srcDir: "./src",
			mode: "production",
			strategies: "injectManifest",
			filename: "service-worker.ts",
			scope: "/",
			base: "/",
			manifest: {
				name: "Oculus-Feldsher",
				short_name: "Oculus",
				description: "Офтальмологическая платформа для управления пациентами",
				theme_color: "#ffffff",
				background_color: "#ffffff",
				display: "standalone",
				start_url: "/",
				icons: [
					{
						src: "/icon-192.png",
						sizes: "192x192",
						type: "image/png",
						purpose: "any maskable"
					},
					{
						src: "/icon-512.png",
						sizes: "512x512",
						type: "image/png",
						purpose: "any maskable"
					}
				]
			},
			injectManifest: {
				globPatterns: ["**/*.{js,css,html,svg,png,ico,txt}"]
			},
			devOptions: {
				enabled: true,
				type: "module",
				navigateFallback: "/"
			}
		})
	]
})
