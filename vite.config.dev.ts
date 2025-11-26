import { defineConfig } from 'vite';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import {
	makeDefaultViteBuildOptions,
	makeViteEditorAlias,
	makeViteEditorCSSOptions,
	makeViteEditorPlugins,
} from '../../build-utils/vite-editor';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
	plugins: makeViteEditorPlugins(),
	appType: 'mpa',
	esbuild: {
		supported: {
			'top-level-await': true,
		},
	},

	define: {
		'import.meta.env.VITE_DOCAUTH_ASSETS_BASE': JSON.stringify('/'),
		'import.meta.env.VITE_DOCAUTH_BUILD_TIME': JSON.stringify(Math.floor(Date.now() / 1000).toString()),
		'import.meta.env.VITE_DOCAUTH_VERSION_STR': JSON.stringify('dev'),
	},

	resolve: {
		alias: {
			...makeViteEditorAlias(),
			'@nutrient-sdk/document-authoring': resolve(__dirname, 'vite-dev-shim.ts'),
		},
	},

	publicDir: 'public',

	server: {
		fs: {
			allow: ['../..'],
		},
	},

	build: {
		...makeDefaultViteBuildOptions(),
		rollupOptions: {
			input: {
				'index.html': resolve(__dirname, 'index.html'),
				'react.html': resolve(__dirname, 'react.html'),
				'javascript.html': resolve(__dirname, 'javascript.html'),
				'javascript-shared.html': resolve(__dirname, 'javascript-shared.html'),
				'actions-and-toolbar.html': resolve(__dirname, 'actions-and-toolbar.html'),
			},
		},
		chunkSizeWarningLimit: 2048,
	},

	...makeViteEditorCSSOptions(),
});
