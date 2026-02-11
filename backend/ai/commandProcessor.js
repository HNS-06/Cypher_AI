import { GoogleGenerativeAI } from '@google/generative-ai';
import config from '../config/config.js';

class CommandProcessor {
    constructor() {
        if (!config.geminiApiKey) {
            console.error('❌ Gemini API key not configured');
            this.genAI = null;
        } else {
            this.genAI = new GoogleGenerativeAI(config.geminiApiKey);
            this.model = this.genAI.getGenerativeModel({ model: config.ai.model });
        }
    }

    /**
     * Parse natural language command into structured task plan
     */
    async parseCommand(command, context = {}) {
        if (!this.genAI) {
            throw new Error('AI service not configured. Please set GEMINI_API_KEY.');
        }

        const prompt = `You are an expert browser automation assistant. Parse the following user command into a detailed, step-by-step execution plan.

User Command: "${command}"

Current Context:
- Current URL: ${context.currentUrl || 'Not navigated yet'}
- Page Title: ${context.pageTitle || 'N/A'}

Return a JSON object with this structure:
{
  "intent": "Brief description of what the user wants to accomplish",
  "steps": [
    {
      "action": "navigate|click|type|scroll|extract|wait|screenshot",
      "target": "CSS selector, URL, or description of element",
      "value": "Value to type or other parameters (optional)",
      "description": "Human-readable description of this step"
    }
  ],
  "expectedOutcome": "What should happen after execution",
  "needsClarification": false,
  "clarificationQuestion": "Question to ask user if unclear (optional)"
}

Available actions:
- navigate: Go to a URL
- click: Click an element (provide CSS selector or description)
- type: Type text into an input (provide selector and value)
- scroll: Scroll the page (up/down/to-element)
- extract: Extract data from page (provide what to extract)
- wait: Wait for element or time
- screenshot: Take a screenshot

Be specific with selectors when possible. If you need to find an element by text, use descriptive targets.`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Extract JSON from response (handle markdown code blocks)
            const jsonMatch = text.match(/```json\n([\s\S]*?)\n```/) || text.match(/\{[\s\S]*\}/);
            if (!jsonMatch) {
                throw new Error('Failed to parse AI response');
            }

            const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);

            return {
                success: true,
                plan: parsed
            };
        } catch (error) {
            console.error('Error parsing command:', error);
            return {
                success: false,
                error: error.message,
                fallback: this.createFallbackPlan(command)
            };
        }
    }

    /**
     * Analyze screenshot and provide insights
     */
    async analyzeScreenshot(imageBase64, question) {
        if (!this.genAI) {
            throw new Error('AI service not configured');
        }

        const visionModel = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash-latest' }); // Free tier model

        const prompt = question || 'Describe what you see in this screenshot. Identify any interactive elements, forms, buttons, or important content.';

        try {
            const result = await visionModel.generateContent([
                prompt,
                {
                    inlineData: {
                        mimeType: 'image/png',
                        data: imageBase64
                    }
                }
            ]);

            const response = await result.response;
            return {
                success: true,
                analysis: response.text()
            };
        } catch (error) {
            console.error('Error analyzing screenshot:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Find element selector from description
     */
    async findElement(description, pageHtml) {
        if (!this.genAI) {
            throw new Error('AI service not configured');
        }

        const prompt = `Given this HTML snippet and a description of an element, provide the best CSS selector to find it.

Element Description: "${description}"

HTML (truncated):
${pageHtml.substring(0, 5000)}

Return ONLY a valid CSS selector, nothing else. Examples:
- button[type="submit"]
- input[name="email"]
- a.nav-link:contains("Login")
- #search-box

Your selector:`;

        try {
            const result = await this.model.generateContent(prompt);
            const response = await result.response;
            const selector = response.text().trim();

            return {
                success: true,
                selector: selector.replace(/```/g, '').trim()
            };
        } catch (error) {
            console.error('Error finding element:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }

    /**
     * Create a simple fallback plan when AI fails
     */
    createFallbackPlan(command) {
        const lowerCommand = command.toLowerCase();

        // Simple pattern matching for common commands
        if (lowerCommand.includes('go to') || lowerCommand.includes('navigate')) {
            const urlMatch = command.match(/https?:\/\/[^\s]+/) || command.match(/[a-z0-9-]+\.[a-z]{2,}/i);
            if (urlMatch) {
                return {
                    intent: 'Navigate to URL',
                    steps: [{
                        action: 'navigate',
                        target: urlMatch[0].startsWith('http') ? urlMatch[0] : `https://${urlMatch[0]}`,
                        description: `Navigate to ${urlMatch[0]}`
                    }],
                    expectedOutcome: 'Page should load',
                    needsClarification: false
                };
            }
        }

        return {
            intent: 'Unknown command',
            steps: [],
            expectedOutcome: 'Unable to parse command',
            needsClarification: true,
            clarificationQuestion: 'I couldn\'t understand that command. Could you rephrase it or be more specific?'
        };
    }
}

export default CommandProcessor;
