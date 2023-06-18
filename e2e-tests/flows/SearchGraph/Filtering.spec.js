const { test, expect } = require('../../../fixtures');


test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:3000/');
});

test('NTIRPs Search filtering', async ({ page }) => {
    await page.getByRole('button', { name: " Visualize Your Data" }).click()
    await page.getByText("test1").click()
    await page.waitForTimeout(3000)
    await page.getByText("NTIRPs Search").click()
    await page.locator('.col-sm-4').nth(1).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
    await page.getByRole("button", { name: "Search" }).click()
    await page.waitForTimeout(3000)
});

test('NTIRPs Search filtering by V.S and M.H.S', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  const inputElementMax_VS = await page.$('.limits-table input[name="maxVSCls0"]')
  await inputElementMax_VS.fill('80')
  await inputElementMax_VS.dispatchEvent('input')
  const inputElementMin_VS = await page.$('.limits-table input[name="minVSCls0"]')
  await inputElementMin_VS.fill('50')
  await inputElementMin_VS.dispatchEvent('input')

  const inputElementMax_MHS = await page.$('.limits-table input[name="maxHSCls0"]')
  await inputElementMax_MHS.fill('99')
  await inputElementMax_MHS.dispatchEvent('input')
  const inputElementMin_MHS = await page.$('.limits-table input[name="minHSCls0"]')
  await inputElementMin_MHS.fill('3')
  await inputElementMin_MHS.dispatchEvent('input')


  await page.waitForTimeout(3000)

  await page.getByRole("button", { name: "Search" }).click()
  await page.waitForTimeout(3000)
});

test('NTIRPs Search copmlete filtering', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  await page.locator('.col-sm-4').nth(0).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.waitForTimeout(3000)

  const inputElementMin_VS = await page.$('.limits-table input[name="minVSCls0"]')
  await inputElementMin_VS.fill('50')
  await inputElementMin_VS.dispatchEvent('input')

  await page.waitForTimeout(3000)

  await page.getByRole("button", { name: "Search" }).click()
  await page.waitForTimeout(3000)
});

test('NTIRPs Search check visable', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  await page.waitForSelector('[test_id="bubble graph"]');
  const isBubbleVisible = await page.evaluate(() => {
    const bubble = document.querySelector('[test_id="bubble graph"]');
    const isVisible = bubble.offsetHeight > 0 && bubble.offsetWidth > 0;
    return isVisible
  });

  expect(isBubbleVisible).toBe(true);
});

test.only('NTIRPs click on bubble', async ({ page }) => {
  await page.getByRole('button', { name: " Visualize Your Data" }).click()
  await page.getByText("test1").click()
  await page.waitForTimeout(3000)
  await page.getByText("NTIRPs Search").click()

  await page.locator('.col-sm-4').nth(1).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.locator('.col-sm-4').nth(2).locator('th').first().locator("input[type=checkbox]").click({ force: true })
  await page.getByRole("button", { name: "Search" }).click()

  await page.waitForTimeout(3000)


  page.on('console', (msg) => {
    for (let i = 0; i < msg.args().length; ++i) {
      console.log(`${i}: ${msg.args()[i]}`);
    }
  });

  const canvas = page.locator('[test_id="bubble graph"]')
  for(let i = 1; i < 50; i++){
    for(let j = 1; j < 50; j++){
      console.log(i, j)
      canvas.click({position: {x:i, y:j}})
    }
  }
  const canvasBoundingBox = await canvas.boundingBox()
  const { x, y, width, height } = canvasBoundingBox;

  // const coordinates = await page.evaluate(() => {
  //   const canvas = document.querySelector('[test_id="bubble graph"]');
  //   canvas.click({position : })
  
  //   const rect = canvas.getBoundingClientRect();
  //   const x = rect.left - window.scrollX;
  //   const y = rect.top - window.scrollY;
  //   const width = canvas.clientWidth;
  //   const height = canvas.clientHeight;

  //   return  { x: x, y: y, width: width, height: height };
  // });

  // const x = coordinates.x;
  // const y = coordinates.y;
  // const width = coordinates.width;
  // const height = coordinates.height

  await page.waitForTimeout(3000)

  const clickStep = 5; // Adjust this value to control the step size of each click
  const maxRight = x + width;
  const maxBottom = y + height;

  let currentX = x;
  let currentY = y;
  let textShown = false;

  while (currentY <= maxBottom) {
    while (currentX <= maxRight) {
      await page.mouse.click(currentX, currentY);

      try {
        // Check if the text "Selected TIRP info" is visible
        const textElement = await page.waitForSelector('text=Selected TIRP info', { timeout: 500 });

        if (textElement) {
          const textContent = await textElement.textContent();
          if (textContent.includes('Selected TIRP info')) {
            textShown = true;
            // Do any additional operations you need when the text is shown
            break;
          } else if (textContent.includes('NTIRP TABLE')) {
            // Stop the loop if "NTIRP TABLE" is shown
            return;
          }
        }
      } catch (error) {
      }

      currentX += clickStep;
    }

    if (textShown) {
      break;
    }

    currentX = maxRight;
    currentY += clickStep;
    await page.mouse.click(currentX, currentY);

    if (currentY <= maxBottom) {
      currentX -= clickStep;
    }
  }

  await page.getByRole('button', { name: "Explore TIRP" }).click()
  await page.waitForTimeout(3000)
})
