# React + TypeScript + Vite

# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and oxlint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Linting with oxlint

This project uses [oxlint](https://oxc-project.github.io/docs/guide/usage/linter.html) for fast and efficient TypeScript/React linting. oxlint provides excellent performance and catches common issues in React applications.

The linting configuration is defined in `.oxlintrc.json` and includes:
- React plugin for React-specific rules
- Import plugin for import/export validation
- TypeScript support out of the box

To run the linter:
```bash
npm run lint
```


For more advanced configuration options, refer to the [oxlint documentation](https://oxc-project.github.io/docs/guide/usage/linter.html).