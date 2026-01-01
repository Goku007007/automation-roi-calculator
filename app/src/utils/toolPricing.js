// Automation tool pricing data - Last Updated: 2025-12-31
// Icons are referenced by name - components should import from Icons.jsx
// Source: Official pricing pages (see URLs)

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
    xai: 'XAIIcon',
    cohere: 'CohereIcon',
};

// ============================================================================
// AUTOMATION PLATFORMS - Official pricing as of 2025-12-31
// ============================================================================
export const TOOLS = {
    zapier: {
        name: 'Zapier',
        description: 'Most popular no-code automation',
        iconName: 'ZapierIcon',
        pricingUnit: 'tasks/month',
        tiers: [
            { name: 'Free', tasks: 100, price: 0, billingNotes: null },
            { name: 'Professional', tasks: null, price: 19.99, billingNotes: 'Billed annually, starting price' },
            { name: 'Team', tasks: null, price: 69, billingNotes: 'Billed annually, starting price' },
        ],
        url: 'https://zapier.com/pricing',
        notes: 'Task allowances vary by plan/add-ons',
    },
    make: {
        name: 'Make (Integromat)',
        description: 'Visual automation with advanced features',
        iconName: 'MakeIcon',
        pricingUnit: 'credits/month',
        tiers: [
            { name: 'Free', operations: 1000, price: 0 },
            { name: 'Core', operations: 10000, price: 9 },
            { name: 'Pro', operations: 30000, price: 16 },
            { name: 'Teams', operations: 100000, price: 29 },
            { name: 'Enterprise', operations: 500000, price: 99 },
        ],
        url: 'https://www.make.com/en/pricing',
        notes: 'Credits/operations vary by module usage',
    },
    n8n: {
        name: 'n8n',
        description: 'Self-hostable workflow automation',
        iconName: 'N8nIcon',
        pricingUnit: 'executions/month',
        tiers: [
            { name: 'Starter', executions: 2500, price: 22, billingNotes: 'Billed annually' },
            { name: 'Pro', executions: 10000, price: 55, billingNotes: 'Billed annually' },
            { name: 'Business', executions: 40000, price: 730, billingNotes: 'Billed annually' },
            { name: 'Enterprise', executions: null, price: 'custom', billingNotes: 'Contact sales' },
        ],
        selfHost: true,
        url: 'https://n8n.io/pricing',
        notes: 'Pricing based on monthly workflow executions, regardless of complexity',
    },
    powerAutomate: {
        name: 'Power Automate',
        description: 'Microsoft ecosystem automation',
        iconName: 'PowerAutomateIcon',
        pricingUnit: 'user or bot/month',
        tiers: [
            { name: 'Premium', runs: 'unlimited', price: 15, perUser: true, billingNotes: 'Paid yearly' },
            { name: 'Process', runs: 'unlimited', price: 150, perBot: true, billingNotes: 'Paid yearly' },
            { name: 'Hosted Process', runs: 'unlimited', price: 215, perBot: true, billingNotes: 'Paid yearly' },
        ],
        url: 'https://www.microsoft.com/en-us/power-platform/products/power-automate/pricing',
        notes: 'Pay-as-you-go pricing also available',
    },
};

// ============================================================================
// AI MODEL PRICING - USD per 1M tokens (Official pricing as of 2025-12-31)
// ============================================================================
export const AI_MODELS = {
    openai: {
        name: 'OpenAI',
        iconName: 'OpenAIIcon',
        url: 'https://platform.openai.com/docs/pricing',
        notes: 'Standard tier pricing. Reasoning tokens billed as output.',
        models: [
            { name: 'GPT-5.2', input: 1.75, cachedInput: 0.175, output: 14.00, flagship: true },
            { name: 'GPT-5-mini', input: 0.25, cachedInput: 0.025, output: 2.00 },
            { name: 'GPT-4.1', input: 2.00, cachedInput: 0.50, output: 8.00 },
            { name: 'GPT-4o', input: 2.50, cachedInput: 1.25, output: 10.00 },
            { name: 'GPT-4o-mini', input: 0.15, cachedInput: 0.075, output: 0.60, costOptimized: true },
            { name: 'o3', input: 2.00, cachedInput: 0.50, output: 8.00, reasoning: true },
            { name: 'o4-mini', input: 1.10, cachedInput: 0.275, output: 4.40, reasoning: true },
        ],
    },
    anthropic: {
        name: 'Anthropic',
        iconName: 'AnthropicIcon',
        url: 'https://platform.claude.com/docs/en/about-claude/pricing',
        notes: 'Base tier with prompt caching multipliers',
        models: [
            { name: 'Claude Opus 4.5', input: 5.00, output: 25.00, cacheWrite5m: 6.25, cacheWrite1h: 10.00, cacheRead: 0.50, flagship: true },
            { name: 'Claude Sonnet 4.5', input: 3.00, output: 15.00, cacheWrite5m: 3.75, cacheWrite1h: 6.00, cacheRead: 0.30 },
            { name: 'Claude Haiku 4.5', input: 1.00, output: 5.00, cacheWrite5m: 1.25, cacheWrite1h: 2.00, cacheRead: 0.10, costOptimized: true },
        ],
    },
    google: {
        name: 'Google (Gemini)',
        iconName: 'GoogleIcon',
        url: 'https://ai.google.dev/pricing',
        notes: 'Standard pricing. Grounding with Google Search costs extra.',
        models: [
            { name: 'Gemini 2.5 Pro', input: 1.25, output: 10.00, flagship: true },
            { name: 'Gemini 2.5 Flash', input: 0.30, output: 2.50, costOptimized: true },
        ],
    },
    xai: {
        name: 'xAI (Grok)',
        iconName: 'XAIIcon',
        url: 'https://x.ai/api',
        notes: 'Rate limits vary by tier. Check xAI Console.',
        models: [
            { name: 'Grok-4-1-fast-reasoning', input: 0.20, output: 0.50, contextWindow: '2M' },
            { name: 'Grok-4-fast-reasoning', input: 0.20, output: 0.50, contextWindow: '2M' },
            { name: 'Grok-code-fast-1', input: 0.20, output: 1.50, contextWindow: '256K' },
            { name: 'Grok-4', input: 3.00, output: 15.00, contextWindow: '256K', flagship: true },
        ],
    },
    cohere: {
        name: 'Cohere',
        iconName: 'CohereIcon',
        url: 'https://cohere.com/pricing',
        notes: 'Legacy model pricing. Command A family: contact sales.',
        models: [
            { name: 'Command R 03-2024', input: 0.50, output: 1.50 },
            { name: 'Command R+ 08-2024', input: 2.50, output: 10.00 },
            { name: 'Aya Expanse (8B/32B)', input: 0.50, output: 1.50 },
        ],
    },
};

// ============================================================================
// MODEL CAPABILITIES MATRIX
// ============================================================================
export const MODEL_CAPABILITIES = {
    openai: {
        toolCalling: true,
        structuredOutputs: true,
        vision: true,
        audio: true,
        promptCaching: true,
        notes: 'Multiple pricing tiers (Batch/Flex/Standard/Priority)',
    },
    anthropic: {
        toolCalling: true,
        structuredOutputs: true,
        vision: true,
        audio: false,
        promptCaching: true,
        notes: 'Cache write/read multipliers explicitly documented',
    },
    google: {
        toolCalling: true,
        structuredOutputs: true,
        vision: true,
        audio: true,
        promptCaching: false,
        notes: 'Distinguishes standard vs search-grounded pricing',
    },
    xai: {
        toolCalling: true,
        structuredOutputs: true,
        vision: true,
        audio: true,
        promptCaching: true,
        notes: 'Rate limits checked via xAI Console',
    },
    cohere: {
        toolCalling: true,
        structuredOutputs: true,
        vision: true,
        audio: false,
        promptCaching: false,
        notes: 'Embed is multimodal family',
    },
};

// ============================================================================
// COST OPTIMIZATION STRATEGIES
// ============================================================================
export const COST_STRATEGIES = {
    routingTiers: {
        title: 'Model Routing Strategy',
        description: 'Route cheap → expensive based on task complexity',
        examples: {
            openai: ['GPT-5-mini', 'GPT-4o/GPT-4.1', 'GPT-5.2'],
            anthropic: ['Haiku 4.5', 'Sonnet 4.5', 'Opus 4.5'],
            google: ['Gemini 2.5 Flash', 'Gemini 2.5 Pro'],
            xai: ['Grok-4-fast-*', 'Grok-4'],
        },
    },
    commonTraps: [
        'Overusing flagship for routine tasks (classification, extraction)',
        'Not caching repeated system prompts / tool schemas',
        'Not bounding outputs (max output tokens) → runaway costs',
        'Tool-loop explosions (agentic retries + tool calls)',
        'RAG over-tokenization (dumping entire documents instead of chunking)',
    ],
    recommendations: [
        { task: 'Intent detection, classification, extraction', model: 'Cheap (mini/flash/haiku)' },
        { task: 'General generation, coding help', model: 'Mid-tier' },
        { task: 'Complex reasoning, long-context synthesis', model: 'Flagship (selective)' },
    ],
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================
export function calculateToolCost(toolId, monthlyTasks) {
    const tool = TOOLS[toolId];
    if (!tool) return null;

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

    const highestTier = tool.tiers[tool.tiers.length - 1];
    const included = highestTier.tasks || highestTier.operations || highestTier.executions || 0;
    const basePrice = typeof highestTier.price === 'number' ? highestTier.price : 0;

    return {
        tier: highestTier.name,
        monthlyCost: basePrice,
        included: typeof included === 'number' ? included : 'unlimited',
        overage: 0,
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

// Last updated timestamp
export const PRICING_LAST_UPDATED = '2025-12-31';
