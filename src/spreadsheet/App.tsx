import SpreadsheetEditor from './components/SpreadsheetEditor';
import { DocAuthSpreadsheetEditor, DocAuthSystem } from '@nutrient-sdk/document-authoring';
import { useCallback, useState } from 'react';
import './App.css';

function App() {
	const [editor, setEditor] = useState<DocAuthSpreadsheetEditor | null>(null);

	const clear = async () => {
		if (editor) {
			const docAuthSystem = editor.docAuthSystem();
			editor.setCurrentSpreadsheet(await docAuthSystem.createSpreadsheetFromPlaintext(''));
		}
	};

	const loadXlsx = async () => {
		if (editor) {
			const docAuthSystem = editor.docAuthSystem();
			editor.setCurrentSpreadsheet(await docAuthSystem.importSpreadsheet(fetch('./sample.xlsx')));
		}
	};

	const loadJson = async () => {
		if (editor) {
			const docAuthSystem = editor.docAuthSystem();
			editor.setCurrentSpreadsheet(await docAuthSystem.loadSpreadsheet(fetch('./sample.sheetjson')));
		}
	};

	const createInitialSpreadsheet = useCallback((docAuthSystem: DocAuthSystem) => {
		return docAuthSystem.createSpreadsheetFromPlaintext('Hi there!');
	}, []);

	return (
		<div className="App">
			<>
				<div className="Header">
					<button onClick={clear}>Clear</button>
					<button onClick={loadXlsx}>Load sample.xlsx</button>
					<button onClick={loadJson}>Load sample.sheetjson</button>
				</div>
				<SpreadsheetEditor initialSpreadsheet={createInitialSpreadsheet} onEditor={setEditor} />
			</>
		</div>
	);
}

export default App;
