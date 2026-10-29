# Document Authoring SDK - Example Project

Please send all your feature requests and bug reports to support@nutrient.io.

## Getting Started

```shell
# Install the dependencies:
npm install
# Run the example in development mode:
npx vite serve
```

## Examples

This project has React and plain JavaScript examples for documents and spreadsheets.

The React document example, `react.html`, loads `src/main.tsx`. The spreadsheet version, `spreadsheet/react.html`, loads `src/spreadsheet/main.tsx`.

The plain JavaScript document examples are `javascript.html` and `javascript-shared.html`. Their source files are `src/javascript-app.js` and `src/javascript-shared-app.js`. The spreadsheet versions use the same filenames under `spreadsheet`, with their source files under `src/spreadsheet`.

## Going Into Production

For a production build issue

```shell
npx vite build
```

The production build (`dist/` folder) can be previewed using:

```shell
npx vite preview
```

## More Information

For more information see `node_modules/@nutrient-sdk/document-authoring/README.md`.
