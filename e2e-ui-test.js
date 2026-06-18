"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const playwright_1 = require("playwright");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const BASE_URL = 'https://branded-fit.vercel.app';
const COMMAND_CONSOLE_URL = `${BASE_URL}/command-console`;
const SCREENSHOT_DIR = '/tmp/e2e-screenshots';
const MAX_WAIT_TIME = 10 * 60 * 1000; // 10 minutes
const POLL_INTERVAL = 3000; // 3 seconds
const results = [];
async function createScreenshotDir() {
    if (!fs_1.default.existsSync(SCREENSHOT_DIR)) {
        fs_1.default.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
}
async function takeScreenshot(page, name) {
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const filename = `${timestamp}_${name}.png`;
    const filepath = path_1.default.join(SCREENSHOT_DIR, filename);
    await page.screenshot({ path: filepath, fullPage: true });
    console.log(`  📸 Screenshot saved: ${filename}`);
    return filepath;
}
async function waitForPipelineCompletion(page, maxWaitMs = MAX_WAIT_TIME) {
    const startTime = Date.now();
    let lastState = null;
    let lastLoggedState = '';
    while (Date.now() - startTime < maxWaitMs) {
        try {
            // Extract pipeline state from the page
            const state = await page.evaluate(() => {
                const stageElements = document.querySelectorAll('[data-stage]');
                const stages = [];
                stageElements.forEach((el) => {
                    const stage = el.getAttribute('data-stage') || 'unknown';
                    const statusEl = el.querySelector('[data-status]');
                    const status = (statusEl?.getAttribute('data-status') || 'pending');
                    stages.push({
                        stage,
                        status,
                        timestamp: new Date().toISOString()
                    });
                });
                // Also check for text-based status indicators
                const pageText = document.body.innerText;
                return {
                    stages,
                    pageText,
                    allCompleted: stages.every((s) => s.status === 'completed' || s.status === 'failed'),
                    hasFailed: stages.some((s) => s.status === 'failed')
                };
            });
            // Log status if it changed
            const currentState = JSON.stringify(state.stages);
            if (currentState !== lastLoggedState) {
                console.log(`\n[${new Date().toLocaleTimeString()}] Pipeline Status:`);
                state.stages.forEach((s) => {
                    const icon = s.status === 'completed'
                        ? '✅'
                        : s.status === 'failed'
                            ? '❌'
                            : s.status === 'in_progress'
                                ? '🔄'
                                : '⏳';
                    console.log(`  ${icon} ${s.stage}: ${s.status}`);
                });
                lastLoggedState = currentState;
                lastState = state.stages[state.stages.length - 1] || null;
            }
            // Check for completion
            if (state.allCompleted) {
                console.log('\n✅ Pipeline completed!');
                return state.stages[state.stages.length - 1];
            }
            // Check for failure
            if (state.hasFailed) {
                console.log('\n❌ Pipeline failed!');
                return state.stages.find((s) => s.status === 'failed') || null;
            }
            // Wait before next poll
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        }
        catch (error) {
            console.error('Error checking pipeline state:', error);
            await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL));
        }
    }
    console.log('\n⏱️ Timeout: Pipeline did not complete within 10 minutes');
    return lastState;
}
async function runTest() {
    let browser = null;
    let page = null;
    try {
        console.log('🚀 Starting Command Console E2E Test\n');
        console.log(`📍 Target URL: ${COMMAND_CONSOLE_URL}`);
        console.log(`⏱️ Max wait time: 10 minutes\n`);
        // Create screenshot directory
        await createScreenshotDir();
        // Launch browser
        console.log('🌐 Launching browser...');
        browser = await playwright_1.chromium.launch();
        page = await browser.newPage();
        // STEP 1: Navigate to Command Console
        console.log('\n📍 STEP 1: Navigate to Command Console');
        console.log(`  URL: ${COMMAND_CONSOLE_URL}`);
        await page.goto(COMMAND_CONSOLE_URL, { waitUntil: 'networkidle', timeout: 30000 });
        console.log('  ✅ Page loaded');
        // Take screenshot of initial state
        console.log('\n📍 STEP 2: Capture initial form state');
        const initialScreenshot = await takeScreenshot(page, '01-initial-form');
        // Check if form is visible
        const formVisible = await page.isVisible('input[placeholder*="domain"], input[placeholder*="Domain"]');
        if (!formVisible) {
            // Try alternative selectors
            const altFormVisible = await page.isVisible('input[type="text"]');
            if (!altFormVisible) {
                throw new Error('Domain input form not visible on page');
            }
        }
        console.log('  ✅ Domain input form is visible');
        // STEP 3: Enter domain
        console.log('\n📍 STEP 3: Enter domain "ramp.com"');
        const domainInput = page.locator('input[placeholder*="domain"], input[placeholder*="Domain"], input[type="text"]').first();
        await domainInput.fill('ramp.com');
        console.log('  ✅ Domain entered');
        // STEP 4: Submit form
        console.log('\n📍 STEP 4: Click "Generate Brand Drop"');
        const submitButton = page.locator('button:has-text("Generate"), button:has-text("Submit"), button:has-text("generate")').first();
        await submitButton.click();
        console.log('  ✅ Form submitted');
        // Take screenshot after submission
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait a bit for page to respond
        const submissionScreenshot = await takeScreenshot(page, '02-after-submission');
        // STEP 5: Monitor pipeline
        console.log('\n📍 STEP 5: Monitor pipeline execution (up to 10 minutes)');
        const finalState = await waitForPipelineCompletion(page);
        // Take screenshot of final state
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const finalScreenshot = await takeScreenshot(page, '03-final-state');
        // STEP 6: Capture Shopify URL if successful
        console.log('\n📍 STEP 6: Extract results');
        let shopifyUrl = null;
        let successMessage = null;
        try {
            const pageText = await page.content();
            // Look for Shopify URL pattern
            const shopifyMatch = pageText.match(/https:\/\/[a-zA-Z0-9-]+\.myshopify\.com/);
            if (shopifyMatch) {
                shopifyUrl = shopifyMatch[0];
                console.log(`  ✅ Shopify URL found: ${shopifyUrl}`);
            }
            // Look for success message
            const successEl = page.locator('text=/success|completed|ready/i').first();
            if (successEl) {
                successMessage = await successEl.textContent();
                console.log(`  ✅ Success message: ${successMessage}`);
            }
        }
        catch (error) {
            console.log('  ℹ️ Could not extract Shopify URL or success message');
        }
        // Determine overall result
        const passed = finalState?.status === 'completed' || !!shopifyUrl;
        results.push({
            name: 'Command Console E2E Test',
            passed,
            timestamp: new Date().toISOString(),
            details: `Domain: ramp.com | Final State: ${finalState?.status || 'unknown'} | Shopify URL: ${shopifyUrl || 'not found'}`,
            screenshots: [initialScreenshot, submissionScreenshot, finalScreenshot]
        });
        // Print summary
        console.log('\n' + '='.repeat(60));
        console.log('📊 TEST SUMMARY');
        console.log('='.repeat(60));
        console.log(`Test: ${results[0].name}`);
        console.log(`Status: ${results[0].passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Details: ${results[0].details}`);
        console.log(`\nScreenshots captured:`);
        results[0].screenshots.forEach((s) => {
            console.log(`  • ${path_1.default.basename(s)}`);
        });
        console.log(`\nScreenshot directory: ${SCREENSHOT_DIR}`);
        console.log('='.repeat(60) + '\n');
    }
    catch (error) {
        console.error('\n❌ Test failed with error:', error);
        results.push({
            name: 'Command Console E2E Test',
            passed: false,
            timestamp: new Date().toISOString(),
            details: `Error: ${error instanceof Error ? error.message : String(error)}`,
            screenshots: []
        });
        process.exit(1);
    }
    finally {
        if (page) {
            await page.close();
        }
        if (browser) {
            await browser.close();
        }
    }
}
runTest().catch(console.error);
