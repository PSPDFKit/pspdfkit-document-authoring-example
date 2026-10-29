import { useEffect, useRef } from 'react';
import { DocAuthSystem, DocAuthSpreadsheet, DocAuthSpreadsheetEditor, createDocAuthSystem } from '@nutrient-sdk/document-authoring';

const SpreadsheetEditor = (props: {
	initialSpreadsheet?: (docAuthSystem: DocAuthSystem) => Promise<DocAuthSpreadsheet>;
	onEditor?: (editor: DocAuthSpreadsheetEditor) => void;
}) => {
	const { initialSpreadsheet, onEditor } = props;
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const target = document.createElement('div') as HTMLDivElement;
		let removed = false;

		const docAuthSystemAndEditorPromise = createDocAuthSystem({
			// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
			// licenseKey: '<YOUR_LICENSE_KEY>',
		}).then(async (docAuthSystem) => {
			const spreadsheet = await (initialSpreadsheet ? initialSpreadsheet(docAuthSystem) : undefined);

			const editor = await docAuthSystem.createSpreadsheetEditor(target, {
				spreadsheet,
			});

			if (!removed) {
				if (containerRef.current) {
					containerRef.current.append(target);
				}

				if (onEditor) {
					onEditor(editor);
				}
			}

			return {
				docAuthSystem,
				editor,
			};
		});

		return () => {
			target.remove();
			removed = true;

			docAuthSystemAndEditorPromise.then(({ docAuthSystem, editor }) => {
				editor.destroy();
				docAuthSystem.destroy();
			});
		};
	}, [onEditor, initialSpreadsheet]);

	return <div ref={containerRef} style={{ flexGrow: '1', position: 'relative' }} />;
};

export default SpreadsheetEditor;
