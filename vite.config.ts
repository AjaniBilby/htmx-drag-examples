import { BundleSplitter, ClientIsland } from "htmx-router/vite";
import { defineConfig, UserConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

type T = NonNullable<UserConfig["plugins"]>[number];

export default defineConfig({
	ssr: {
		noExternal: ['vite'],
	},
	build: {
		target: "esnext",
		rollupOptions: {
			input: 'app/entry.client.ts'
		},
		outDir: 'dist/client',
		assetsDir: 'dist/asset',
		ssrEmitAssets: true,
		manifest: true
	},
	plugins: [
		ClientIsland("react") as T,
		BundleSplitter() as T,
		tsconfigPaths(),
	],
});
