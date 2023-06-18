const { test, expect } = require('../../../fixtures');


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('test Relation matrix displayed', async ({ page }) => {
    // Expect a title "to contain" a substring.
    await page.getByRole('button', {name: " Visualize Your Data"}).click()
    await page.getByText("test1").click()
    await page.waitForTimeout(3000)
    await page.getByText("NegativeTirps").click()
    await page.locator('#toy_example-btn').first().click()
    await page.locator('#toy_example-btn').first().click()
    await page.getByRole('button', {name: "Get Relations"}).click()
    expect(await page.getByTestId('test-matrix')).toBeVisible()
});

test('test Mean Presentation Graph displayed', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.getByRole('button', {name: " Visualize Your Data"}).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NegativeTirps").click()
  await page.locator('tr').nth(1).click()
  await page.getByRole('button', {name: "Get Relations"}).click()
  expect(await page.getByText('Mean Presentation')).toBeVisible()
});

test('test massive navigating', async ({ page }) => {
  // Expect a title "to contain" a substring.
  await page.getByRole('button', {name: " Visualize Your Data"}).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NegativeTirps").click()
  for (let i = 0; i < 50; i++) {
    await page.locator('#toy_example-btn').first().click()
    await page.locator('#toy_example-btn').first().click()
    await page.getByText('ROOT').click()
  }
});