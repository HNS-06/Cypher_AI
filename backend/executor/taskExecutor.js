import BrowserController from '../browser/controller.js';
import CommandProcessor from '../ai/commandProcessor.js';

class TaskExecutor {
    constructor() {
        this.browser = new BrowserController();
        this.ai = new CommandProcessor();
        this.currentTask = null;
        this.executionLog = [];
    }

    /**
     * Execute a user command
     */
    async executeCommand(command, onProgress) {
        this.executionLog = [];
        this.log('info', `📋 Received command: ${command}`);

        try {
            // Get current page context
            const contextResult = await this.browser.getContext();
            const context = contextResult.success ? contextResult.context : {};

            // Parse command with AI
            this.log('info', '🤖 Parsing command with AI...');
            onProgress?.({ status: 'parsing', message: 'Understanding your command...' });

            const parseResult = await this.ai.parseCommand(command, context);

            if (!parseResult.success) {
                this.log('error', `Failed to parse command: ${parseResult.error}`);
                if (parseResult.fallback) {
                    this.log('info', 'Using fallback plan...');
                    return await this.executePlan(parseResult.fallback, onProgress);
                }
                throw new Error(parseResult.error);
            }

            const plan = parseResult.plan;

            // Check if clarification needed
            if (plan.needsClarification) {
                this.log('warning', `Clarification needed: ${plan.clarificationQuestion}`);
                return {
                    success: false,
                    needsClarification: true,
                    question: plan.clarificationQuestion,
                    log: this.executionLog
                };
            }

            this.log('success', `✅ Parsed into ${plan.steps.length} steps`);
            this.log('info', `Intent: ${plan.intent}`);

            // Execute the plan
            return await this.executePlan(plan, onProgress);

        } catch (error) {
            this.log('error', `Execution failed: ${error.message}`);
            return {
                success: false,
                error: error.message,
                log: this.executionLog
            };
        }
    }

    /**
     * Execute a parsed plan
     */
    async executePlan(plan, onProgress) {
        this.currentTask = plan;
        const results = [];

        for (let i = 0; i < plan.steps.length; i++) {
            const step = plan.steps[i];
            this.log('info', `\n📍 Step ${i + 1}/${plan.steps.length}: ${step.description}`);

            onProgress?.({
                status: 'executing',
                step: i + 1,
                total: plan.steps.length,
                message: step.description
            });

            try {
                const result = await this.executeStep(step);
                results.push(result);

                if (!result.success) {
                    this.log('error', `Step failed: ${result.error}`);

                    // Try to recover or continue
                    if (this.shouldRetry(step, result)) {
                        this.log('info', '🔄 Retrying step...');
                        const retryResult = await this.executeStep(step);
                        results[results.length - 1] = retryResult;

                        if (!retryResult.success) {
                            this.log('error', 'Retry failed, stopping execution');
                            break;
                        }
                    } else {
                        this.log('warning', 'Continuing to next step...');
                    }
                } else {
                    this.log('success', `✅ Step completed`);
                }

                // Take screenshot after important steps
                if (this.shouldScreenshot(step)) {
                    const screenshot = await this.browser.screenshot();
                    if (screenshot.success) {
                        results[results.length - 1].screenshot = screenshot.screenshot;
                    }
                }

            } catch (error) {
                this.log('error', `Step error: ${error.message}`);
                results.push({
                    success: false,
                    error: error.message,
                    step: step.description
                });
                break;
            }
        }

        // Final screenshot
        const finalScreenshot = await this.browser.screenshot();

        const allSuccess = results.every(r => r.success);

        return {
            success: allSuccess,
            plan: plan,
            results: results,
            screenshot: finalScreenshot.success ? finalScreenshot.screenshot : null,
            log: this.executionLog,
            expectedOutcome: plan.expectedOutcome
        };
    }

    /**
     * Execute a single step
     */
    async executeStep(step) {
        const { action, target, value } = step;

        switch (action) {
            case 'navigate':
                return await this.browser.navigate(target);

            case 'click':
                // If target is a description, try to find selector
                if (!target.match(/^[#.\[a-zA-Z]/)) {
                    const contextResult = await this.browser.getContext();
                    if (contextResult.success) {
                        const findResult = await this.ai.findElement(target, contextResult.context.html);
                        if (findResult.success) {
                            return await this.browser.click(findResult.selector);
                        }
                    }
                }
                return await this.browser.click(target);

            case 'type':
                return await this.browser.type(target, value, { clear: true });

            case 'scroll':
                return await this.browser.scroll(target || 'down', value || 500);

            case 'extract':
                return await this.browser.extract(target, value || 'textContent');

            case 'wait':
                const waitTime = typeof target === 'number' ? target : (value || 2000);
                return await this.browser.wait(waitTime);

            case 'screenshot':
                return await this.browser.screenshot({ fullPage: value === 'full' });

            default:
                return {
                    success: false,
                    error: `Unknown action: ${action}`
                };
        }
    }

    /**
     * Determine if step should be retried
     */
    shouldRetry(step, result) {
        // Retry clicks and types if they fail
        return ['click', 'type'].includes(step.action) &&
            result.error?.includes('waiting for selector');
    }

    /**
     * Determine if screenshot should be taken
     */
    shouldScreenshot(step) {
        return ['navigate', 'click'].includes(step.action);
    }

    /**
     * Log execution events
     */
    log(level, message) {
        const entry = {
            timestamp: new Date().toISOString(),
            level,
            message
        };
        this.executionLog.push(entry);

        const emoji = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        console.log(`${emoji[level] || ''} ${message}`);
    }

    /**
     * Clean up resources
     */
    async cleanup() {
        await this.browser.close();
    }
}

export default TaskExecutor;
