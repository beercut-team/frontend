import adapter from "@sveltejs/adapter-node"

/** @type {import('@sveltejs/kit').Config} */
const config = {
	kit: {
		adapter: adapter(),
		files: {
			routes: "src/app/routes", // move routing inside the app layer
			lib: "src",
			appTemplate: "src/app/index.html", // Move the application entry point inside the app layer
			assets: "public",
		},
		alias: {
			"@/*": "src/*", // Create an alias for the src directory
		},
	},
}

export default config
