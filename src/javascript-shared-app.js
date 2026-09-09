// Load the JS module.
import DocAuth from '@nutrient-sdk/document-authoring';

// Load the base Document Authoring system. The WASM and font code is initialized here.
// The `docAuthSystem` can be re-used between multiple editor instances or used to
// export PDFs or import DOCX documents without the need to instantiate the visual
// editor.
const docAuthSystem = await DocAuth.createDocAuthSystem({
	// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
	// licenseKey: '<YOUR_LICENSE_KEY>',
});

// A PDF can be created without the need for an editor instance.
document.getElementById('headless').onclick = async () => {
	const createdDocument = await docAuthSystem.createDocumentFromPlaintext(`Hello World!\n\nISO date: ${new Date().toISOString()}`);
	const pdfBlob = await createdDocument.exportPDF();
	window.open(URL.createObjectURL(new Blob([pdfBlob], { type: 'application/pdf' })));
};

// Instantiate a visual document authoring editor.
const editor1 = await docAuthSystem.createEditor(document.getElementById('editor1'), {
	document: await docAuthSystem.createDocumentFromPlaintext('Hi there!\n\nHow are you?'),
});

// Instantiate another visual document authoring editor.
const editor2 = await docAuthSystem.createEditor(document.getElementById('editor2'), {
	document: await docAuthSystem.loadDocument(await fetch('./sample.json').then((e) => e.json())),
});

document.getElementById('docx').onclick = async () => {
	const doc = await docAuthSystem.importDOCX(fetch('./sample.docx'));
	editor1.setCurrentDocument(doc);
};

// We can copy the document from `editor1` to `editor2` by exporting and importing it as either
// a JSON string (`exportDocumentJSON`) or an equivalent object (`exportDocument`).
document.getElementById('copy1to2').onclick = async () => {
	// "Clone" the document by saving and loading it again.
	editor2.setCurrentDocument(await docAuthSystem.loadDocument(editor1.currentDocument().saveDocument()));
};

// Dev exports.

window.DocAuth = DocAuth;
window.docAuthSystem = docAuthSystem;
window.editor1 = editor1;
window.editor2 = editor2;
