import { GenerateRouteTree } from 'htmx-router/router';
export const tree = GenerateRouteTree({
	modules: import.meta.glob('./routes/**/*.{ts,tsx}', { eager: true }),
	scope: "./routes",
});
