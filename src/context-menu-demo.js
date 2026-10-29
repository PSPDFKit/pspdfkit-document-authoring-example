import DocAuth from '@nutrient-sdk/document-authoring';

const docAuthSystem = await DocAuth.createDocAuthSystem({
	// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
	// licenseKey: '<YOUR_LICENSE_KEY>',
});

const initialText = `Context Menu API Demo

Select some text in this document and right-click it. After the built-in items, the menu shows two custom actions:

"Search the web" opens a web search for the selected text in a new tab.

"Add to notes" copies the selected text into the Notes panel next to the editor.

Both actions are greyed out when nothing is selected.`;

const SEARCH_URL = 'https://duckduckgo.com/?q=';

const svgIcon = (paths) =>
	`data:image/svg+xml,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#444" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`,
	)}`;
const SEARCH_ICON = svgIcon('<circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 14 14"/>');
const NOTE_ICON = svgIcon('<path d="M3.5 2.5h9v11h-9z"/><path d="M6 6h4M6 8.5h4M6 11h2"/>');

let editor = null;

// The selection as one trimmed line, or '' when nothing is selected.
const selectedText = () => (editor?.getSelectionContent({ format: 'text' }) ?? '').replace(/\s+/g, ' ').trim();

const notesHintEl = document.getElementById('notes-hint');
const notesListEl = document.getElementById('notes-list');

const addNote = (text) => {
	const item = document.createElement('li');
	item.textContent = text;
	notesListEl.append(item);
	notesHintEl.hidden = true;
};

editor = await docAuthSystem.createEditor(document.getElementById('editor'), {
	document: await docAuthSystem.createDocumentFromPlaintext(initialText),
	ui: {
		// Register the custom actions next to the built-in ones.
		actions: [
			...DocAuth.defaultActions,
			{
				id: 'custom.search-web',
				label: 'Search the web',
				icon: SEARCH_ICON,
				isEnabled: () => selectedText() !== '',
				handler: () => {
					const query = selectedText().slice(0, 200);
					window.open(SEARCH_URL + encodeURIComponent(query), '_blank', 'noopener,noreferrer');
				},
			},
			{
				id: 'custom.add-to-notes',
				label: 'Add to notes',
				icon: NOTE_ICON,
				isEnabled: () => selectedText() !== '',
				handler: () => addNote(selectedText()),
			},
		],
		// Add them to the menu that opens when the user right-clicks text, after the built-in items.
		contextMenu: {
			text: {
				items: [
					{
						type: 'group',
						id: 'selection-tools',
						title: 'Selection tools',
						items: [
							{ type: 'action', id: 'search-web', actionId: 'custom.search-web' },
							{ type: 'action', id: 'add-to-notes', actionId: 'custom.add-to-notes' },
						],
					},
				],
			},
		},
	},
});

window.editor = editor;
window.DocAuth = DocAuth;
