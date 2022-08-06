import { expect, test } from '@playwright/test';

test('index page has greetings', async ({ page }) => {
	await page.goto('/');
	const locator = page.locator('#greetings');
	await expect(locator).toContainText('Hello there, my name is BB-Bob.');
});
