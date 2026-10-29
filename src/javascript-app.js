import DocAuth from '@nutrient-sdk/document-authoring';

const docAuthSystem = await DocAuth.createDocAuthSystem({
	// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
	// licenseKey: '<YOUR_LICENSE_KEY>',
});

const editor = await docAuthSystem.createEditor(document.getElementById('editor'), {
	document: await docAuthSystem.createDocumentFromPlaintext('Hi there!'),
});

// Dev exports.

window.DocAuth = DocAuth;
window.docAuthSystem = docAuthSystem;
window.editor = editor;
