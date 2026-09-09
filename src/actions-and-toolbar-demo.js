import DocAuth from '@nutrient-sdk/document-authoring';

// Helper to escape HTML to prevent XSS
function escapeHtml(str) {
	const div = document.createElement('div');
	div.textContent = str;
	return div.innerHTML;
}

const docAuthSystem = await DocAuth.createDocAuthSystem({
	// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
	// licenseKey: '<YOUR_LICENSE_KEY>',
});

const initialText = `Actions & Toolbar API Demo

This demo shows how to register custom actions and customize the toolbar.

Features:
• Register custom actions with handlers
• Add/remove built-in toolbar elements
• Add custom action buttons to the toolbar
• Configure toolbar presets

Try the controls below to test the Actions and Toolbar APIs!`;

const editor = await docAuthSystem.createEditor(document.getElementById('editor'), {
	document: await docAuthSystem.createDocumentFromPlaintext(initialText),
});

window.editor = editor;
window.DocAuth = DocAuth;

// load defaults
const defaultActions = DocAuth.defaultActions;
const defaultToolbarConfig = DocAuth.defaultToolbarConfig;

// Track current toolbar config locally (starting with default config)
let currentConfigItems = [...defaultToolbarConfig.items];
const BUILT_IN_TYPES = [
	'zoom',
	'mobile-lock',
	'undo',
	'redo',
	'style-menu',
	'font-family',
	'font-size',
	'bold',
	'italic',
	'underline',
	'strikethrough',
	'subscript',
	'superscript',
	'text-color',
	'highlight-color',
	'align-left',
	'align-center',
	'align-right',
	'align-justify',
	'line-spacing-menu',
	'bulleted-list',
	'numbered-list',
	'decrease-indent',
	'increase-indent',
	'clear-formatting',
	'formatting-marks',
	'page-setup-menu',
	'insert-menu',
	'table-menu',
	'download-menu',
	'ui-settings-menu',
];

function updateToolbarStatus() {
	const statusElement = document.getElementById('toolbar-status');
	const itemCount = currentConfigItems.length;
	const actionCount = currentConfigItems.filter((item) => item.type === 'action').length;
	const builtInCount = currentConfigItems.filter((item) => item.type === 'built-in').length;
	const separatorCount = currentConfigItems.filter((item) => item.type === 'separator').length;

	statusElement.textContent = `Toolbar: ${itemCount} items (${actionCount} actions, ${builtInCount} built-in, ${separatorCount} separators)`;
	const itemsList = document.getElementById('current-items');
	itemsList.innerHTML = '';

	currentConfigItems.forEach((item, index) => {
		const li = document.createElement('li');
		let itemText = '';

		switch (item.type) {
			case 'action':
				itemText = `${index + 1}. Action: ${item.actionId}`;
				break;
			case 'built-in':
				itemText = `${index + 1}. Built-in: ${item.builtInType}`;
				break;
			case 'separator':
				itemText = `${index + 1}. Separator`;
				break;
		}

		li.textContent = itemText;
		itemsList.appendChild(li);
	});
}

function setupBuiltInControls() {
	const selector = document.getElementById('builtin-selector');
	BUILT_IN_TYPES.forEach((type) => {
		const option = document.createElement('option');
		option.value = type;
		option.textContent = type;
		selector.appendChild(option);
	});

	document.getElementById('btn-add-builtin').onclick = () => {
		const selectedType = selector.value;
		if (!selectedType) {
			alert('Please select a built-in type');
			return;
		}

		const newItem = {
			type: 'built-in',
			id: `${selectedType}-${Date.now()}`,
			builtInType: selectedType,
		};

		currentConfigItems = [...currentConfigItems, newItem];
		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	};

	document.getElementById('btn-delete-last').onclick = () => {
		if (currentConfigItems.length === 0) {
			alert('No items to delete');
			return;
		}

		currentConfigItems = currentConfigItems.slice(0, -1);
		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	};

	document.getElementById('btn-clear-toolbar').onclick = () => {
		const confirmClear = confirm('Are you sure you want to clear the entire toolbar?');
		if (!confirmClear) return;

		currentConfigItems = [];

		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
		console.log('Cleared toolbar');
	};

	document.getElementById('btn-add-separator').onclick = () => {
		const newSeparator = {
			type: 'separator',
			id: `separator-${Date.now()}`,
		};

		currentConfigItems = [...currentConfigItems, newSeparator];
		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	};
}

function setupActionElementControl() {
	let registeredCustomActions = new Map();

	// Base64 encoded SVG icon for timestamp (safe image URL)
	const timestampIconURL = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iY3VycmVudENvbG9yIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNi41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PGxpbmUgeDE9IjgiIHkxPSI4IiB4Mj0iMTEiIHkyPSI4IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxsaW5lIHgxPSI4IiB5MT0iOCIgeDI9IjgiIHkyPSI0LjUiIHN0cm9rZT0iY3VycmVudENvbG9yIiBzdHJva2Utd2lkdGg9IjEiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjxjaXJjbGUgY3g9IjgiIGN5PSI4IiByPSIwLjUiIGZpbGw9ImN1cnJlbnRDb2xvciIvPjwvc3ZnPg==';

	// Sample custom actions that can be registered
	const sampleCustomActions = [
		{
			id: 'custom.insert-timestamp',
			label: 'Insert Timestamp',
			description: 'Insert current date and time',
			shortcuts: ['Ctrl+Alt+T'],
			icon: timestampIconURL, // Image URL (base64 encoded SVG)
			handler: async () => {
				try {
					const timestamp = new Date().toLocaleString();
					editor.insertTextAtCursor(`Timestamp: ${timestamp}`);
					console.log('Timestamp inserted via custom action!');
				} catch (error) {
					console.error('Failed to insert timestamp:', error);
				}
			},
			isEnabled: () => editor.hasActiveCursor(),
		},
		{
			id: 'custom.save-pdf-docx',
			label: 'Save PDF and DOCX',
			description: 'Export document in both PDF and DOCX formats',
			shortcuts: ['Cmd+Shift+D'],
			handler: async () => {
				try {
					const pdfBuffer = await editor.currentDocument().exportPDF();
					const pdfBlob = new Blob([pdfBuffer], { type: 'application/pdf' });
					const pdfUrl = URL.createObjectURL(pdfBlob);
					const pdfLink = document.createElement('a');
					pdfLink.href = pdfUrl;
					pdfLink.download = 'document.pdf';
					pdfLink.click();
					URL.revokeObjectURL(pdfUrl);

					const docxBuffer = await editor.currentDocument().exportDOCX();
					const docxBlob = new Blob([docxBuffer], {
						type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
					});
					const docxUrl = URL.createObjectURL(docxBlob);
					const docxLink = document.createElement('a');
					docxLink.href = docxUrl;
					docxLink.download = 'document.docx';
					docxLink.click();
					URL.revokeObjectURL(docxUrl);
				} catch (error) {
					console.error('Export failed:', error);
					alert(`Export failed: ${error.message}`);
				}
			},
		},
		{
			id: 'custom.editor-info',
			label: 'Editor Info',
			description: 'Display editor and document information',
			shortcuts: ['Cmd+Shift+L'],
			handler: async () => {
				try {
					const message = `Editor Information:
• Toolbar Items: ${currentConfigItems.length}
• Document Type: Document Authoring SDK
• Editor Status: Active`;
					alert(message);
				} catch (error) {
					console.error('Failed to get editor info:', error);
				}
			},
		},
	];

	// Populate custom actions dropdown
	function populateCustomActions() {
		const customSelector = document.getElementById('custom-action-selector');
		customSelector.innerHTML = '<option value="">Choose a custom action...</option>';
		registeredCustomActions.forEach((action, actionId) => {
			const option = document.createElement('option');
			option.value = actionId;
			option.textContent = `${action.label} (${actionId})`;
			customSelector.appendChild(option);
		});
	}

	// Initialize custom actions dropdown (no action type selector needed)
	populateCustomActions();

	// Register sample custom actions
	document.getElementById('btn-register-sample-actions').onclick = () => {
		sampleCustomActions.forEach((action) => {
			registeredCustomActions.set(action.id, action);
		});

		// Register with the actions API - keep original built-in actions
		const customActionsArray = Array.from(registeredCustomActions.values());
		const allActions = [...defaultActions, ...customActionsArray];
		editor.setActions(allActions);

		populateCustomActions();

		const instructions = document.getElementById('action-instructions');
		instructions.style.display = 'block';
		instructions.innerHTML = `
            <p><strong>Sample Custom Actions Registered!</strong></p>
            <p>Registered ${sampleCustomActions.length} sample custom actions. You can now select and add them to the editor.toolbar.</p>
        `;

		setTimeout(() => {
			instructions.style.display = 'none';
		}, 3000);
	};

	// Add custom action to toolbar
	document.getElementById('btn-add-action').onclick = () => {
		const actionId = document.getElementById('custom-action-selector').value;

		if (!actionId) {
			alert('Please select a custom action to add');
			return;
		}

		// Add the action to the toolbar
		const actionItem = {
			type: 'action',
			id: `custom-${actionId}-${Date.now()}`,
			actionId: actionId,
		};

		currentConfigItems = [...currentConfigItems, actionItem];
		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();

		const actionLabel = document.getElementById('custom-action-selector').selectedOptions[0].textContent;

		const instructions = document.getElementById('action-instructions');
		instructions.style.display = 'block';
		instructions.innerHTML = `
            <p><strong>Custom Action Added to Toolbar!</strong></p>
            <p>Added custom action: <strong>${escapeHtml(actionLabel)}</strong></p>
        `;

		setTimeout(() => {
			instructions.style.display = 'none';
		}, 2000);
	};

	// Delete last action (shared functionality)
	function deleteLastAction() {
		const lastIndex = currentConfigItems.length - 1;
		if (lastIndex >= 0) {
			currentConfigItems = currentConfigItems.slice(0, -1);
			editor.setToolbarConfig({ items: currentConfigItems });
			updateToolbarStatus();
		}
	}

	// Clear toolbar (shared functionality)
	function clearToolbar() {
		currentConfigItems = [];
		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	}

	// Attach shared functions to both sections
	document.getElementById('btn-delete-last-action').onclick = deleteLastAction;
	document.getElementById('btn-clear-toolbar-action').onclick = clearToolbar;

	// Also attach to built-in section buttons
	document.getElementById('btn-delete-last').onclick = deleteLastAction;
	document.getElementById('btn-clear-toolbar').onclick = clearToolbar;
}

function setupQuickPresets() {
	// Essential Writing preset - focused on core writing needs
	document.getElementById('btn-preset-minimal').onclick = () => {
		currentConfigItems = [
			// Document controls
			{ type: 'built-in', id: 'undo-1', builtInType: 'undo' },
			{ type: 'built-in', id: 'redo-1', builtInType: 'redo' },
			{ type: 'separator', id: 'sep-1' },

			// Style and font
			{ type: 'built-in', id: 'style-menu-1', builtInType: 'style-menu' },
			{ type: 'built-in', id: 'font-family-1', builtInType: 'font-family' },
			{ type: 'built-in', id: 'font-size-1', builtInType: 'font-size' },
			{ type: 'separator', id: 'sep-2' },

			// Core formatting
			{ type: 'built-in', id: 'bold-1', builtInType: 'bold' },
			{ type: 'built-in', id: 'italic-1', builtInType: 'italic' },
			{ type: 'built-in', id: 'underline-1', builtInType: 'underline' },
			{ type: 'separator', id: 'sep-3' },

			// Lists for structure
			{ type: 'built-in', id: 'bulleted-list-1', builtInType: 'bulleted-list' },
			{ type: 'built-in', id: 'numbered-list-1', builtInType: 'numbered-list' },
			{ type: 'separator', id: 'sep-4' },

			// Essential tools
			{ type: 'built-in', id: 'insert-menu-1', builtInType: 'insert-menu' },
			{ type: 'built-in', id: 'download-menu-1', builtInType: 'download-menu' },
		];

		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	};

	// Professional Editor preset - comprehensive editing tools
	document.getElementById('btn-preset-full').onclick = () => {
		currentConfigItems = [
			// View controls
			{ type: 'built-in', id: 'zoom-1', builtInType: 'zoom' },
			{ type: 'separator', id: 'sep-1' },

			// Document actions
			{ type: 'built-in', id: 'undo-1', builtInType: 'undo' },
			{ type: 'built-in', id: 'redo-1', builtInType: 'redo' },
			{ type: 'separator', id: 'sep-2' },

			// Styles and typography
			{ type: 'built-in', id: 'style-menu-1', builtInType: 'style-menu' },
			{ type: 'built-in', id: 'font-family-1', builtInType: 'font-family' },
			{ type: 'built-in', id: 'font-size-1', builtInType: 'font-size' },
			{ type: 'separator', id: 'sep-3' },

			// Character formatting
			{ type: 'built-in', id: 'bold-1', builtInType: 'bold' },
			{ type: 'built-in', id: 'italic-1', builtInType: 'italic' },
			{ type: 'built-in', id: 'underline-1', builtInType: 'underline' },
			{ type: 'built-in', id: 'strikethrough-1', builtInType: 'strikethrough' },
			{ type: 'built-in', id: 'superscript-1', builtInType: 'superscript' },
			{ type: 'built-in', id: 'subscript-1', builtInType: 'subscript' },
			{ type: 'separator', id: 'sep-4' },

			// Colors
			{ type: 'built-in', id: 'text-color-1', builtInType: 'text-color' },
			{ type: 'built-in', id: 'highlight-color-1', builtInType: 'highlight-color' },
			{ type: 'separator', id: 'sep-5' },

			// Paragraph formatting
			{ type: 'built-in', id: 'align-left-1', builtInType: 'align-left' },
			{ type: 'built-in', id: 'align-center-1', builtInType: 'align-center' },
			{ type: 'built-in', id: 'align-right-1', builtInType: 'align-right' },
			{ type: 'built-in', id: 'align-justify-1', builtInType: 'align-justify' },
			{ type: 'built-in', id: 'line-spacing-menu-1', builtInType: 'line-spacing-menu' },
			{ type: 'separator', id: 'sep-6' },

			// Lists and indentation
			{ type: 'built-in', id: 'bulleted-list-1', builtInType: 'bulleted-list' },
			{ type: 'built-in', id: 'numbered-list-1', builtInType: 'numbered-list' },
			{ type: 'built-in', id: 'decrease-indent-1', builtInType: 'decrease-indent' },
			{ type: 'built-in', id: 'increase-indent-1', builtInType: 'increase-indent' },
			{ type: 'separator', id: 'sep-7' },

			// Content tools
			{ type: 'built-in', id: 'insert-menu-1', builtInType: 'insert-menu' },
			{ type: 'built-in', id: 'table-menu-1', builtInType: 'table-menu' },
			{ type: 'built-in', id: 'page-setup-menu-1', builtInType: 'page-setup-menu' },
			{ type: 'separator', id: 'sep-8' },

			// Utilities
			{ type: 'built-in', id: 'clear-formatting-1', builtInType: 'clear-formatting' },
			{ type: 'built-in', id: 'formatting-marks-1', builtInType: 'formatting-marks' },
			{ type: 'separator', id: 'sep-9' },

			// Export and settings
			{ type: 'built-in', id: 'download-menu-1', builtInType: 'download-menu' },
			{ type: 'built-in', id: 'ui-settings-menu-1', builtInType: 'ui-settings-menu' },
		];

		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	};

	// Clean Slate preset
	document.getElementById('btn-preset-empty').onclick = () => {
		currentConfigItems = [];

		editor.setToolbarConfig({ items: currentConfigItems });
		updateToolbarStatus();
	};
}

function setupConfigDisplay() {
	document.getElementById('btn-show-config').onclick = () => {
		const output = document.getElementById('config-output');
		output.textContent = JSON.stringify({ items: currentConfigItems }, null, 2);
		output.style.display = 'block';
	};

	document.getElementById('btn-hide-config').onclick = () => {
		const output = document.getElementById('config-output');
		output.style.display = 'none';
	};
}

function setupConsoleHelpers() {
	console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Actions & Toolbar API - Console Examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Available Globals:
  • editor                        - The editor instance
  • DocAuth.defaultActions        - Array of built-in actions
  • DocAuth.defaultToolbarConfig  - Default toolbar configuration

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Toolbar Configuration Examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] Clear the toolbar:
    editor.setToolbarConfig({ items: [] })

[2] Reset to default:
    editor.setToolbarConfig(DocAuth.defaultToolbarConfig)

[3] Add a button to default toolbar:
    editor.setToolbarConfig({
      items: [
        ...DocAuth.defaultToolbarConfig.items,
        { type: 'separator', id: 'sep-custom' },
        { type: 'built-in', id: 'bold-extra', builtInType: 'bold' }
      ]
    })

[4] Create minimal toolbar:
    editor.setToolbarConfig({
      items: [
        { type: 'built-in', id: 'undo-1', builtInType: 'undo' },
        { type: 'built-in', id: 'redo-1', builtInType: 'redo' },
        { type: 'separator', id: 'sep-1' },
        { type: 'built-in', id: 'bold-1', builtInType: 'bold' },
        { type: 'built-in', id: 'italic-1', builtInType: 'italic' }
      ]
    })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Custom Actions Examples
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

[1] Register a simple custom action:
    editor.setActions([
      ...DocAuth.defaultActions,
      {
        id: 'custom.hello',
        label: 'Say Hello',
        description: 'Insert greeting text',
        shortcuts: ['Ctrl+Alt+H'],
        handler: () => editor.insertTextAtCursor('Hello from custom action!')
      }
    ])

[2] Register an action with icon and conditions:
    editor.setActions([
      ...DocAuth.defaultActions,
      {
        id: 'custom.timestamp',
        label: 'Insert Timestamp',
        description: 'Insert current date and time',
        shortcuts: ['Ctrl+Alt+T'],
        icon: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0iY3VycmVudENvbG9yIj48Y2lyY2xlIGN4PSI4IiBjeT0iOCIgcj0iNi41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIi8+PGxpbmUgeDE9IjgiIHkxPSI4IiB4Mj0iMTEiIHkyPSI4IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxLjUiLz48bGluZSB4MT0iOCIgeTE9IjgiIHgyPSI4IiB5Mj0iNC41IiBzdHJva2U9ImN1cnJlbnRDb2xvciIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9zdmc+',
        handler: () => editor.insertTextAtCursor(new Date().toLocaleString()),
        isEnabled: () => editor.hasActiveCursor()
      }
    ])

[3] Add custom action to toolbar:
    editor.setToolbarConfig({
      items: [
        ...DocAuth.defaultToolbarConfig.items,
        { type: 'action', id: 'my-action-1', actionId: 'custom.timestamp' },
        { type: 'separator', id: 'sep-custom' }
      ]
    })

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  Available Built-in Types
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${BUILT_IN_TYPES.map((type) => `  • ${type}`).join('\n')}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  TIP: Use Cmd (resolves to Ctrl on Windows, ⌘ on Mac) for cross-platform shortcuts
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

function initialize() {
	setupBuiltInControls();
	setupActionElementControl();
	setupQuickPresets();
	setupConfigDisplay();
	setupConsoleHelpers();

	// Initial status update
	updateToolbarStatus();
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
	document.addEventListener('DOMContentLoaded', initialize);
} else {
	initialize();
}
