import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	appType: 'mpa',
	esbuild: {
		supported: {
			'top-level-await': true,
		},
	},
	build: {
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
});
