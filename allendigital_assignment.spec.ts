import { test, chromium, expect } from "@playwright/test";

test.setTimeout(90000);

test("Compare iPhone 15 Plus price on Flipkart vs Amazon (Interleaved)", async function run() {
  const browser = await chromium.launch({ headless: false });
  const context = await browser.newContext();

  const amazonPage = await context.newPage();
  const flipkartPage = await context.newPage();

  const initialSearch = "iphone 15 plus";

  // Step 1: Navigate to Amazon and Flipkart
  console.log("🌐 Navigating to Amazon and Flipkart...");
  await Promise.all([
    amazonPage.goto("https://www.amazon.in/"),
    flipkartPage.goto("https://www.flipkart.com/")
  ]);

  // Step 2: Search on Amazon
  console.log("🔎 Searching for product on Amazon...");
  await amazonPage.fill("#twotabsearchtextbox", initialSearch);
  await amazonPage.press("#twotabsearchtextbox", "Enter");
  await amazonPage.waitForTimeout(3000);

  const firstAmazonProduct = amazonPage
    .locator('div.s-main-slot div[data-component-type="s-search-result"]')
    .first();
  await firstAmazonProduct.waitFor({ timeout: 5000 });

  const amazonTitle = await firstAmazonProduct.locator("h2 span").textContent();
  if (!amazonTitle) throw new Error("❌ Amazon product title not found");

  console.log(`📦 Amazon Product Title: ${amazonTitle.trim()}`);

  // Step 3: Close Flipkart login popup
  console.log("🚫 Closing Flipkart login popup (if any)...");
  try {
    const popup = flipkartPage.locator('button:has-text("✕")');
    if (await popup.isVisible()) await popup.click();
  } catch {}

  // Step 4: Search on Flipkart using the Amazon product title
  console.log("🔎 Searching on Flipkart using Amazon title...");
  await flipkartPage.fill('input[name="q"]', amazonTitle);
  await flipkartPage.press('input[name="q"]', "Enter");
  await flipkartPage.waitForTimeout(3000);

  // Step 5: Extract Amazon price
  const amazonPrices = await amazonPage
    .locator("span.a-price-whole")
    .allTextContents();
  const rawAmazonPrice = amazonPrices.find((p) => p.length > 2);
  const amazonPrice = rawAmazonPrice ? parseInt(rawAmazonPrice.replace(/[^0-9]/g, ""), 10) : null;

  if (!amazonPrice) throw new Error("❌ Amazon price not found");

  console.log(`💰 Amazon Price: ₹${amazonPrice} for "${amazonTitle.trim()}"`);

  // Step 6: Extract Flipkart product details
  console.log("🔍 Extracting product details from Flipkart...");
  const item = flipkartPage
    .locator("div.tUxRFH")
    .filter({ hasText: "iPhone 15 Plus" })
    .first();

  await item.waitFor({ timeout: 10000 });

  const flipkartTitle = await item.locator("div.KzDlHZ").first().textContent();
  const flipkartPriceText = await item.locator("div.Nx9bqj._4b5DiR").first().textContent();
  const flipkartPrice = flipkartPriceText
    ? parseInt(flipkartPriceText.replace(/[^0-9]/g, ""), 10)
    : null;

  if (!flipkartPrice || !flipkartTitle)
    throw new Error("❌ Flipkart product not found");

  console.log(`💸 Flipkart Price: ₹${flipkartPrice} for "${flipkartTitle.trim()}"`);

  // Step 7: Log and compare results
  console.log("🔍 Final Comparison:");
  console.log(`📦 Amazon → "${amazonTitle.trim()}" @ ₹${amazonPrice}`);
  console.log(`🛒 Flipkart → "${flipkartTitle.trim()}" @ ₹${flipkartPrice}`);

  if (flipkartPrice < amazonPrice) {
    console.log("✅ Flipkart is cheaper. ✅ Test Passed.");
  } else {
    console.log("❌ Flipkart is not cheaper. ❌ Test Failed.");
  }

  // Step 8: Assertions
  expect(flipkartPage.url()).toContain("flipkart.com");
  expect(amazonPage.url()).toContain("amazon.in");
  expect(amazonTitle.toLowerCase()).toContain("iphone");
  expect(flipkartTitle.toLowerCase()).toContain("iphone");


  expect(flipkartPrice).toBeLessThan(amazonPrice);


  await browser.close();
});
