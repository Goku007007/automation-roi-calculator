// Automation tool pricing data (as of 2024)
// Icons are referenced by name - components should import from Icons.jsx

export const TOOL_ICONS = {
    zapier: 'ZapierIcon',
    make: 'MakeIcon',
    n8n: 'N8nIcon',
    powerAutomate: 'PowerAutomateIcon',
};

export const AI_ICONS = {
    openai: 'OpenAIIcon',
    anthropic: 'AnthropicIcon',
    google: 'GoogleIcon',
};

export const TOOLS = {
    zapier: {
        name: 'Zapier',
        description: 'Most popular no-code automation',
        iconName: 'ZapierIcon',
        tiers: [
            { name: 'Free', tasks: 100, price: 0, multiStep: false },
            { name: 'Starter', tasks: 750, price: 19.99, multiStep: true },
            { name: 'Professional', tasks: 2000, price: 49, multiStep: true },
            { name: 'Team', tasks: 50000, price: 69, multiStep: true },
            { name: 'Enterprise', tasks: 100000, price: 99, multiStep: true },
        ],
        perTaskOverage: 0.01,
        url: 'https://zapier.com/pricing',
    },
    make: {
        name: 'Make (Integromat)',
        description: 'Visual automation with advanced features',
        iconName: 'MakeIcon',
        tiers: [
            { name: 'Free', operations: 1000, price: 0 },
            { name: 'Core', operations: 10000, price: 9, activeScenarios: 3 },
            { name: 'Pro', operations: 30000, price: 16, activeScenarios: 'unlimited' },
            { name: 'Teams', operations: 100000, price: 29, users: 'unlimited' },
            { name: 'Enterprise', operations: 500000, price: 99 },
        ],
        perOperationOverage: 0.002,
        url: 'https://www.make.com/en/pricing',
    },
    n8n: {
        name: 'n8n',
        description: 'Self-hostable workflow automation',
        iconName: 'N8nIcon',
        tiers: [
            { name: 'Community (Self-hosted)', executions: 'unlimited', price: 0 },
            { name: 'Starter', executions: 2500, price: 20 },
            { name: 'Pro', executions: 10000, price: 50 },
            { name: 'Enterprise', executions: 'unlimited', price: 'custom' },
        ],
        selfHost: true,
        url: 'https://n8n.io/pricing',
    },
    powerAutomate: {
        name: 'Power Automate',
        description: 'Microsoft ecosystem automation',
        iconName: 'PowerAutomateIcon',
        tiers: [
            { name: 'Per User', runs: 'unlimited', price: 15, perUser: true },
            { name: 'Per User + RPA', runs: 'unlimited', price: 40, perUser: true, rpa: true },
            { name: 'Per Flow', runs: 'unlimited', price: 100, perFlow: true },
        ],
        url: 'https://powerautomate.microsoft.com/pricing/',
    },
};

// AI Model pricing (per 1M tokens)
export const AI_MODELS = {
    openai: {
        name: 'OpenAI',
        iconName: 'OpenAIIcon',
        models: [
            { name: 'GPT-4o', input: 2.50, output: 10.00 },
            { name: 'GPT-4o-mini', input: 0.15, output: 0.60 },
            { name: 'GPT-4-turbo', input: 10.00, output: 30.00 },
            { name: 'GPT-3.5-turbo', input: 0.50, output: 1.50 },
        ],
    },
    anthropic: {
        name: 'Anthropic',
        iconName: 'AnthropicIcon',
        models: [
            { name: 'Claude 3.5 Sonnet', input: 3.00, output: 15.00 },
            { name: 'Claude 3 Haiku', input: 0.25, output: 1.25 },
            { name: 'Claude 3 Opus', input: 15.00, output: 75.00 },
        ],
    },
    google: {
        name: 'Google',
        iconName: 'GoogleIcon',
        models: [
            { name: 'Gemini 2.0 Flash', input: 0.075, output: 0.30 },
            { name: 'Gemini 1.5 Pro', input: 1.25, output: 5.00 },
            { name: 'Gemini 1.5 Flash', input: 0.075, output: 0.30 },
        ],
    },
};

// Helper to calculate monthly cost
export function calculateToolCost(toolId, monthlyTasks) {
    const tool = TOOLS[toolId];
    if (!tool) return null;

    // Find best tier that covers the usage
    for (const tier of tool.tiers) {
        const limit = tier.tasks || tier.operations || tier.executions || tier.runs;
        const price = typeof tier.price === 'number' ? tier.price : 0;

        if (limit === 'unlimited' || (typeof limit === 'number' && limit >= monthlyTasks)) {
            return {
                tier: tier.name,
                monthlyCost: price,
                included: limit,
                overage: 0,
            };
        }
    }

    // Use highest tier with overage
    const highestTier = tool.tiers[tool.tiers.length - 1];
    const included = highestTier.tasks || highestTier.operations || highestTier.executions || 0;
    const basePrice = typeof highestTier.price === 'number' ? highestTier.price : 0;
    const overageRate = tool.perTaskOverage || tool.perOperationOverage || 0;
    const numericIncluded = typeof included === 'number' ? included : 0;
    const overage = Math.max(0, monthlyTasks - numericIncluded) * overageRate;

    return {
        tier: highestTier.name,
        monthlyCost: basePrice + overage,
        included: numericIncluded,
        overage,
    };
}

export function calculateAICost(provider, model, monthlyInputTokens, monthlyOutputTokens) {
    const providerData = AI_MODELS[provider];
    if (!providerData) return null;

    const modelData = providerData.models.find(m => m.name === model);
    if (!modelData) return null;

    const inputCost = (monthlyInputTokens / 1000000) * modelData.input;
    const outputCost = (monthlyOutputTokens / 1000000) * modelData.output;

    return {
        model: modelData.name,
        inputCost,
        outputCost,
        totalCost: inputCost + outputCost,
    };
}
