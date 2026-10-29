import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [react()],
	appType: 'mpa',
	build: {
		rolldownOptions: {
			input: {
				'index.html': resolve(__dirname, 'index.html'),
				'react.html': resolve(__dirname, 'react.html'),
				'javascript.html': resolve(__dirname, 'javascript.html'),
				'javascript-shared.html': resolve(__dirname, 'javascript-shared.html'),
				'actions-and-toolbar.html': resolve(__dirname, 'actions-and-toolbar.html'),
				'fragment-api.html': resolve(__dirname, 'fragment-api.html'),
				'spreadsheet/javascript.html': resolve(__dirname, 'spreadsheet/javascript.html'),
				'spreadsheet/javascript-shared.html': resolve(__dirname, 'spreadsheet/javascript-shared.html'),
				'spreadsheet/react.html': resolve(__dirname, 'spreadsheet/react.html'),
				'context-menu.html': resolve(__dirname, 'context-menu.html'),
			},
		},
		chunkSizeWarningLimit: 2048,
	},
});
