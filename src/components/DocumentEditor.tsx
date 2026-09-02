import { useEffect, useRef } from 'react';
import { DocAuthSystem, DocAuthDocument, DocAuthEditor, createDocAuthSystem } from '@nutrient-sdk/document-authoring';

const DocumentEditor = (props: {
	initialDocument?: (docAuthSystem: DocAuthSystem) => Promise<DocAuthDocument>;
	onEditor?: (editor: DocAuthEditor) => void;
}) => {
	const { initialDocument, onEditor } = props;
	const containerRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		const target = document.createElement('div') as HTMLDivElement;
		let removed = false;

		const docAuthSystemAndEditorPromise = createDocAuthSystem({
			// assets: { base: '<CUSTOM_DOCUMENT_AUTHORING_ASSETS_LOCATION>' },
			// licenseKey: '<YOUR_LICENSE_KEY>',
		}).then(async (docAuthSystem) => {
			const doc = await (initialDocument ? initialDocument(docAuthSystem) : undefined);

			const editor = await docAuthSystem.createEditor(target, {
				document: doc,
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
	}, [onEditor, initialDocument]);

	return <div ref={containerRef} style={{ flexGrow: '1', position: 'relative' }} />;
};

export default DocumentEditor;
