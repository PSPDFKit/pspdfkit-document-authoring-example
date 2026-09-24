import DocAuth, { isDocAuthError } from '@nutrient-sdk/document-authoring';

const docAuthSystem = await DocAuth.createDocAuthSystem({
	// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
	// licenseKey: '<YOUR_LICENSE_KEY>',
});

const initialText = `Fragment API Demo

Selection scope:
- editor.getSelectionContent({ format: 'text' | 'fragment' }) — read the current range
- editor.insertContentAtCursor({ format: 'text' | 'fragment', content }) — insert content (replaces any active selection)

Whole-document scope:
- doc.saveDocument({ format: 'fragment' }) — serialise the whole document as a fragment
- system.loadDocument(input, { format: 'fragment' }) — parse a fragment into a new document

Select some text below, click "Read selection as fragment", click somewhere else, then "Insert at cursor".

Quick brown fox jumps over the lazy dog.
The five boxing wizards jump quickly.
Pack my box with five dozen liquor jugs.`;

const editor = await docAuthSystem.createEditor(document.getElementById('editor'), {
	document: await docAuthSystem.createDocumentFromPlaintext(initialText),
});

window.editor = editor;
window.DocAuth = DocAuth;

// captured fragment lives in this closure across button clicks
let lastFragment = null;

const statusEl = document.getElementById('status');
const fragmentJsonEl = document.getElementById('fragment-json');
const errorEl = document.getElementById('error-display');

const setStatus = (text, kind = 'info') => {
	statusEl.textContent = text;
	statusEl.className = 'status ' + kind;
};

const renderFragment = (fragment) => {
	if (fragment === null) {
		fragmentJsonEl.textContent = '(none — no range selected when last read)';
		return;
	}

	fragmentJsonEl.textContent = JSON.stringify(fragment, null, 2);
};

const renderError = (err) => {
	if (!err) {
		errorEl.textContent = '';
		errorEl.style.display = 'none';
		return;
	}

	errorEl.style.display = 'block';

	if (isDocAuthError(err)) {
		errorEl.textContent = `${err.type} — ${err.message}`;
	} else if (err instanceof Error) {
		errorEl.textContent = `Unexpected error: ${err.message}`;
	} else {
		errorEl.textContent = `Unknown error: ${String(err)}`;
	}
};

document.getElementById('btn-read-fragment').addEventListener('click', () => {
	renderError(null);

	const fragment = editor.getSelectionContent({ format: 'fragment' });
	lastFragment = fragment;
	renderFragment(fragment);

	if (fragment === null) {
		setStatus('No range selected. Make a text selection in the editor first.', 'warn');
	} else {
		setStatus('Fragment captured. Click "Insert at cursor" to round-trip it.', 'ok');
	}
});

document.getElementById('btn-read-text').addEventListener('click', () => {
	renderError(null);

	const text = editor.getSelectionContent({ format: 'text' });

	if (text === null) {
		setStatus("No range selected. getSelectionContent({ format: 'text' }) returned null.", 'warn');
	} else {
		setStatus(`Selected text: ${JSON.stringify(text)}`, 'ok');
	}
});

document.getElementById('btn-insert-fragment').addEventListener('click', () => {
	renderError(null);

	if (lastFragment === null) {
		setStatus('Nothing to insert — read a fragment first.', 'warn');
		return;
	}

	try {
		editor.insertContentAtCursor({ format: 'fragment', content: lastFragment });
		setStatus('Fragment inserted. Click into the editor and try again.', 'ok');
	} catch (err) {
		setStatus('Insert failed — see error below.', 'err');
		renderError(err);
	}
});

document.getElementById('btn-roundtrip-json').addEventListener('click', () => {
	renderError(null);

	if (lastFragment === null) {
		setStatus('Nothing to round-trip — read a fragment first.', 'warn');
		return;
	}

	// packaged fragments are JSON-serializable.
	const wire = JSON.stringify(lastFragment);
	const reconstituted = JSON.parse(wire);

	try {
		editor.insertContentAtCursor({ format: 'fragment', content: reconstituted });
		setStatus(`Round-tripped through ${wire.length}-char JSON and re-inserted.`, 'ok');
	} catch (err) {
		setStatus('Round-trip failed — see error below.', 'err');
		renderError(err);
	}
});

document.getElementById('btn-insert-malformed').addEventListener('click', () => {
	renderError(null);

	// deliberately malformed — wrong type tag
	const malformed = {
		type: 'wrong/tag',
		version: 13,
		fragment: { content: [] },
	};

	try {
		editor.insertContentAtCursor({ format: 'fragment', content: malformed });
		setStatus('Unexpected: malformed fragment was accepted.', 'err');
	} catch (err) {
		setStatus('Caught the expected error — see below.', 'ok');
		renderError(err);
	}
});

document.getElementById('btn-clear').addEventListener('click', () => {
	lastFragment = null;
	renderFragment(null);
	renderError(null);
	setStatus('Cleared captured fragment.', 'info');
});

document.getElementById('btn-save-doc-as-fragment').addEventListener('click', async () => {
	renderError(null);

	try {
		const fragment = await editor.currentDocument().saveDocument({ format: 'fragment' });
		lastFragment = fragment;
		renderFragment(fragment);
		setStatus('Saved whole document as a fragment. Click "Load whole document from fragment" to round-trip it.', 'ok');
	} catch (err) {
		setStatus('Save failed — see error below.', 'err');
		renderError(err);
	}
});

document.getElementById('btn-load-doc-from-fragment').addEventListener('click', async () => {
	renderError(null);

	if (lastFragment === null) {
		setStatus('Nothing to load — save the document as a fragment first.', 'warn');
		return;
	}

	try {
		const newDoc = await docAuthSystem.loadDocument(lastFragment, { format: 'fragment' });
		editor.setCurrentDocument(newDoc);
		setStatus('Loaded document from fragment — editor swapped to the new document.', 'ok');
	} catch (err) {
		setStatus('Load failed — see error below.', 'err');
		renderError(err);
	}
});

setStatus('Ready. Make a selection in the editor and click a button.', 'info');
