import { defineConfig } from 'cypress';

export default defineConfig({
	projectId: 'i9gjgb',
	e2e: {
		experimentalStudio: true,
		setupNodeEvents(on, config) {
			// implement node event listeners here
		},
		baseUrl: 'http://localhost:5174',
		watchForFileChanges: true
	}
});
