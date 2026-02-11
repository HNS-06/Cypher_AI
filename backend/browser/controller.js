import puppeteer from 'puppeteer';
import config from '../config/config.js';

class BrowserController {
    constructor() {
        this.browser = null;
        this.page = null;
        this.isInitialized = false;
    }

    /**
     * Initialize browser instance
     */
    async initialize() {
        if (this.isInitialized) {
            return;
        }

        try {
            console.log('🚀 Launching browser...');
            this.browser = await puppeteer.launch({
                headless: config.browser.headless,
                defaultViewport: config.browser.defaultViewport,
                args: config.browser.args
            });

            this.page = await this.browser.newPage();

            // Set default timeout
            this.page.setDefaultTimeout(config.browser.timeout);

            // Enable console logging from browser
            this.page.on('console', msg => {
                console.log('🌐 Browser Console:', msg.text());
            });

            this.isInitialized = true;
            console.log('✅ Browser initialized successfully');
        } catch (error) {
            console.error('❌ Failed to initialize browser:', error);
            throw error;
        }
    }

    /**
     * Navigate to URL
     */
    async navigate(url) {
        await this.ensureInitialized();

        try {
            // Add protocol if missing
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                url = 'https://' + url;
            }

            console.log(`🔗 Navigating to: ${url}`);
            await this.page.goto(url, { waitUntil: 'networkidle2' });

            return {
                success: true,
                url: this.page.url(),
                title: await this.page.title()
            };
        } catch (error) {
            console.error('❌ Navigation failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Click an element
     */
    async click(selector) {
        await this.ensureInitialized();

        try {
            console.log(`👆 Clicking: ${selector}`);

            // Wait for element to be visible
            await this.page.waitForSelector(selector, { visible: true });
            await this.page.click(selector);

            // Wait a bit for any navigation or changes
            await this.page.waitForTimeout(1000);

            return {
                success: true,
                message: `Clicked ${selector}`
            };
        } catch (error) {
            console.error('❌ Click failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Type text into an element
     */
    async type(selector, text, options = {}) {
        await this.ensureInitialized();

        try {
            console.log(`⌨️  Typing into: ${selector}`);

            await this.page.waitForSelector(selector, { visible: true });

            // Clear existing text if specified
            if (options.clear) {
                await this.page.click(selector, { clickCount: 3 });
                await this.page.keyboard.press('Backspace');
            }

            await this.page.type(selector, text, { delay: options.delay || 50 });

            return {
                success: true,
                message: `Typed into ${selector}`
            };
        } catch (error) {
            console.error('❌ Type failed:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Scroll the page
     */
    async scroll(direction = 'down', amount = 500) {
        await this.ensureInitialized();

        try {
            const scrollAmount = direction === 'up' ? -amount : amount;
            await this.page.evaluate((scroll) => {
                window.scrollBy(0, scroll);
            }, scrollAmount);

            await this.page.waitForTimeout(500);

            return {
                success: true,
                message: `Scrolled ${direction}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Extract data from page
     */
    async extract(selector, attribute = 'textContent') {
        await this.ensureInitialized();

        try {
            const data = await this.page.evaluate((sel, attr) => {
                const elements = document.querySelectorAll(sel);
                return Array.from(elements).map(el => {
                    if (attr === 'textContent') return el.textContent.trim();
                    if (attr === 'innerHTML') return el.innerHTML;
                    return el.getAttribute(attr);
                });
            }, selector, attribute);

            return {
                success: true,
                data
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Wait for element or time
     */
    async wait(target, timeout = 5000) {
        await this.ensureInitialized();

        try {
            if (typeof target === 'number') {
                await this.page.waitForTimeout(target);
            } else {
                await this.page.waitForSelector(target, { timeout });
            }

            return {
                success: true,
                message: `Waited for ${target}`
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Take screenshot
     */
    async screenshot(options = {}) {
        await this.ensureInitialized();

        try {
            const screenshot = await this.page.screenshot({
                encoding: 'base64',
                fullPage: options.fullPage || false,
                type: 'png'
            });

            return {
                success: true,
                screenshot,
                timestamp: Date.now()
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Get page context
     */
    async getContext() {
        await this.ensureInitialized();

        try {
            const url = this.page.url();
            const title = await this.page.title();
            const html = await this.page.content();

            return {
                success: true,
                context: {
                    currentUrl: url,
                    pageTitle: title,
                    html: html.substring(0, 10000) // Limit HTML size
                }
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Execute custom JavaScript
     */
    async evaluate(script) {
        await this.ensureInitialized();

        try {
            const result = await this.page.evaluate(script);
            return {
                success: true,
                result
            };
        } catch (error) {
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Close browser
     */
    async close() {
        if (this.browser) {
            await this.browser.close();
            this.browser = null;
            this.page = null;
            this.isInitialized = false;
            console.log('🔒 Browser closed');
        }
    }

    /**
     * Ensure browser is initialized
     */
    async ensureInitialized() {
        if (!this.isInitialized) {
            await this.initialize();
        }
    }
}

export default BrowserController;
