// Load the JS module.
import DocAuth from '@nutrient-sdk/document-authoring';

// Load the base Document Authoring system. The WASM and font code is initialized here.
// The `docAuthSystem` can be re-used between multiple editor instances or used to
// export PDFs or import XLSX spreadsheets without the need to instantiate the visual
// editor.
const docAuthSystem = await DocAuth.createDocAuthSystem({
	// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
	// licenseKey: '<YOUR_LICENSE_KEY>',
});

// A PDF can be created without the need for an editor instance.
document.getElementById('headless').onclick = async () => {
	const createdSpreadsheet = await docAuthSystem.createSpreadsheetFromPlaintext(`ISO date: ${new Date().toISOString()}`);
	const pdfBuffer = await createdSpreadsheet.export({ format: 'pdf' });
	window.open(URL.createObjectURL(new Blob([pdfBuffer], { type: 'application/pdf' })));
};

// Instantiate a visual spreadsheet editor.
const editor1 = await docAuthSystem.createSpreadsheetEditor(document.getElementById('editor1'), {
	spreadsheet: await docAuthSystem.createSpreadsheetFromPlaintext('Hi there!'),
});

// Instantiate another visual spreadsheet editor.
const editor2 = await docAuthSystem.createSpreadsheetEditor(document.getElementById('editor2'), {
	spreadsheet: await docAuthSystem.loadSpreadsheet(fetch('./sample.sheetjson')),
});

document.getElementById('xlsx').onclick = async () => {
	const spreadsheet = await docAuthSystem.importSpreadsheet(fetch('./sample.xlsx'));
	editor1.setCurrentSpreadsheet(spreadsheet);
};

// We can copy the spreadsheet from `editor1` to `editor2` by saving it (`saveSpreadsheet`)
// and loading it again (`loadSpreadsheet`).
document.getElementById('copy1to2').onclick = async () => {
	// "Clone" the spreadsheet by saving and loading it again.
	editor2.setCurrentSpreadsheet(await docAuthSystem.loadSpreadsheet(editor1.currentSpreadsheet().saveSpreadsheet()));
};

// Dev exports.

window.DocAuth = DocAuth;
window.docAuthSystem = docAuthSystem;
window.editor1 = editor1;
window.editor2 = editor2;
