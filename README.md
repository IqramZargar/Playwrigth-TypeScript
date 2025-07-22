📱 Price Comparison: iPhone 15 Plus on Amazon vs Flipkart
This project uses Playwright to compare the price of iPhone 15 Plus on Amazon India and Flipkart, running the steps interleaved across two pages in parallel.

🚀 Features
Automates searches on both Amazon and Flipkart

Extracts product title and price from each

Compares prices and logs which is cheaper

Uses Playwright's multi-tab and async capabilities

Includes basic assertion checks to ensure reliability

📂 Project Structure

📁 playwright-typescript/
├── tests/
│   └── comparePrices.spec.ts   # The main Playwright test file
├── package.json
├── playwright.config.ts
└── README.md
🧰 Tech Stack
Playwright

TypeScript

Node.js

🛠️ Setup Instructions
Clone the repository


git clone https://github.com/IqramZargar/Playwrigth-TypeScript.git
cd Playwrigth-TypeScript
Install dependencies


npm install
Run the test


npx playwright test
Optional: You can run in headed mode by modifying the script or using Playwright’s CLI flags.

📸 What It Does (Step-by-Step)
Launches Chromium browser (non-headless)

Opens Amazon and Flipkart in two tabs

Searches for "iPhone 15 Plus" on Amazon

Copies the product title from Amazon

Uses that title to search on Flipkart

Extracts the price from both sites

Compares them and logs which is cheaper

Performs assertions to validate the flow

✅ Sample Output

📦 Amazon Product Title: Apple iPhone 15 Plus (128 GB) - Blue
💰 Amazon Price: ₹89,900
💸 Flipkart Price: ₹87,999
✅ Flipkart is cheaper. ✅ Test Passed.
⚠️ Notes
Both websites may change structure over time — selectors may need to be updated.

Script runs in headed mode to simulate real interaction (useful for debugging).

Flipkart’s login popup is auto-handled.

📄 License
This project is licensed under the MIT License. See the LICENSE file for details.

✨ Author
Made with ❤️ by Muhammad Iqram Zargar

