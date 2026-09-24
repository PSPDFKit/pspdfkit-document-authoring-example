import DocumentEditor from './components/DocumentEditor';
import { DocAuthEditor, DocAuthSystem } from '@nutrient-sdk/document-authoring';
import { useCallback, useState } from 'react';
import './App.css';

function App() {
	const [editor, setEditor] = useState<DocAuthEditor | null>(null);

	const clear = async () => {
		if (editor) {
			const docAuthSystem = editor.docAuthSystem();
			editor.setCurrentDocument(await docAuthSystem.createDocumentFromPlaintext(''));
		}
	};

	const loadDocx = async () => {
		if (editor) {
			const docAuthSystem = editor.docAuthSystem();
			editor.setCurrentDocument(await docAuthSystem.importDOCX(fetch('./sample.docx')));
		}
	};

	const loadJson = async () => {
		if (editor) {
			const docAuthSystem = editor.docAuthSystem();
			editor.setCurrentDocument(await docAuthSystem.loadDocument(fetch('./sample.json')));
		}
	};

	const createInitialDocument = useCallback((docAuthSystem: DocAuthSystem) => {
		return docAuthSystem.createDocumentFromPlaintext('Hi there!');
	}, []);

	return (
		<div className="App">
			<>
				<div className="Header">
					<button onClick={clear}>Clear</button>
					<button onClick={loadDocx}>Load example.docx</button>
					<button onClick={loadJson}>Load example.json</button>
				</div>
				<DocumentEditor initialDocument={createInitialDocument} onEditor={setEditor} />
			</>
		</div>
	);
}

export default App;
