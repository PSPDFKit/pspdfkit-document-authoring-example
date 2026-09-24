// Development shim that mimics the production entry point
// In production, the entry point dynamically imports the impl
// In dev mode, we import it directly from the source
export { createDocAuthSystem } from '../../packaging/impl/src/docauth-impl';
export {
	isDocAuthError,
	isInvalidFragmentTypeError,
	isUnsupportedFragmentVersionError,
	isMissingFragmentContentError,
} from '../../packages/api/src/browser/fragments';

export type {
	DocAuthSystem,
	DocAuthEditorEvents,
	DocAuthEditorEventHandler,
	DocAuthEditor,
	DocAuthDocument,
	Assets,
	CreateEditorOptions,
	CreateDocAuthSystemOptions,
	DocAuthDocumentInput,
	BlobInput,
	ExportPDFOptions,
	ExportDOCXOptions,
	ImportDOCXOptions,
	FontConfig,
	DefaultFontIndex,
	FontIndex,
	FontFile,
	CreateDocumentFromPlaintextOptions,
	TransactionCallback,
	TransactionResult,
	Programmatic,
	UIOptions,
	Locale,
	Unit,
	Action,
	ToolbarItem,
	ToolbarActionItem,
	ToolbarBuiltInItem,
	ToolbarSeparatorItem,
	ToolbarConfig,
} from '../../packages/api/src/browser/root';

export type {
	DocAuthError,
	InvalidFragmentTypeError,
	UnsupportedFragmentVersionError,
	MissingFragmentContentError,
} from '../../packages/api/src/browser/fragments';

import { createDocAuthSystem, defaultActions, defaultToolbarConfig } from '../../packaging/impl/src/docauth-impl';
import {
	isDocAuthError,
	isInvalidFragmentTypeError,
	isUnsupportedFragmentVersionError,
	isMissingFragmentContentError,
} from '../../packages/api/src/browser/fragments';
import type { DefaultFontIndex } from '../../packages/api/src/browser/root';

export const defaultFontIndex: DefaultFontIndex = { type: 'default-index' };

// re-export defaults directly
export { defaultActions, defaultToolbarConfig };

// create default export matching production bundle
const defaultExport = {
	createDocAuthSystem,
	defaultFontIndex,
	defaultActions,
	defaultToolbarConfig,
	isDocAuthError,
	isInvalidFragmentTypeError,
	isUnsupportedFragmentVersionError,
	isMissingFragmentContentError,
};

export default defaultExport;
