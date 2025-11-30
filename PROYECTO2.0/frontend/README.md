# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Backend integration

This project expects a backend API. By default the frontend will use `http://localhost:4000` as the API base URL. You can override this by creating an env variable for Vite named `VITE_API_BASE_URL`.

- To use the default (localhost:4000) nothing is required.
- To point to a different backend, create a `.env` file in the project root with:

```
VITE_API_BASE_URL=http://localhost:4000
```

All API modules import the centralized `src/api/apiClient.js` which exposes the `BASE_URL` and helpers. When you connect your backend, ensure the endpoints match the paths used in `src/api/*` (for example `/products/top`, `/auth/login`, `/ordenes`).

