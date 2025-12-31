import { TOOLS, AI_MODELS } from '../utils/toolPricing';
import {
    ZapierIcon, MakeIcon, N8nIcon, PowerAutomateIcon,
    OpenAIIcon, AnthropicIcon, GoogleIcon,
    TargetIcon, TrendingUpIcon, BrainIcon, RefreshIcon,
    ExternalLinkIcon
} from '../components/ui/Icons';
import styles from './Docs.module.css';

// Map icon names to components for tools
const toolIconComponents = {
    ZapierIcon,
    MakeIcon,
    N8nIcon,
    PowerAutomateIcon,
};

// Map icon names to components for AI providers
const aiIconComponents = {
    OpenAIIcon,
    AnthropicIcon,
    GoogleIcon,
};

function getToolIcon(iconName) {
    const IconComponent = toolIconComponents[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
}

function getAIIcon(iconName) {
    const IconComponent = aiIconComponents[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
}

export default function Docs() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Documentation</h1>
                    <p className={styles.subtitle}>
                        Reference for automation tool pricing, AI model costs, and API rates.
                    </p>
                </div>

                {/* Automation Tools Section */}
                <section className={styles.section}>
                    <h2>Automation Tool Pricing</h2>
                    <p className={styles.intro}>
                        Monthly pricing for popular automation platforms. Costs vary based on tasks, operations, or executions.
                    </p>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <caption className={styles.tableCaption}>
                                Automation platform pricing comparison by tier
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Tool</th>
                                    <th scope="col">Tier</th>
                                    <th scope="col">Included</th>
                                    <th scope="col">Price/mo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(TOOLS).map(([key, tool]) => (
                                    tool.tiers.map((tier, i) => (
                                        <tr key={`${key}-${i}`}>
                                            {i === 0 && (
                                                <td rowSpan={tool.tiers.length} className={styles.toolName}>
                                                    <span className={styles.logo}>
                                                        {getToolIcon(tool.iconName)}
                                                    </span>
                                                    <div>
                                                        <strong>{tool.name}</strong>
                                                        <a
                                                            href={tool.url}
                                                            target="_blank"
                                                            rel="noopener noreferrer"
                                                            className={styles.link}
                                                        >
                                                            <span>Official pricing</span>
                                                            <ExternalLinkIcon size={12} />
                                                        </a>
                                                    </div>
                                                </td>
                                            )}
                                            <td>{tier.name}</td>
                                            <td>
                                                {tier.tasks?.toLocaleString() ||
                                                    tier.operations?.toLocaleString() ||
                                                    tier.executions?.toLocaleString() ||
                                                    tier.runs || '—'}
                                                {tier.tasks ? ' tasks' : tier.operations ? ' ops' : tier.executions ? ' exec' : ''}
                                            </td>
                                            <td className={styles.price}>
                                                {tier.price === 0 ? 'Free' : tier.price === 'custom' ? 'Custom' : `$${tier.price}`}
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* AI Models Section */}
                <section className={styles.section}>
                    <h2>AI Model Pricing</h2>
                    <p className={styles.intro}>
                        Cost per million tokens for major AI providers. Input and output tokens are priced separately.
                    </p>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <caption className={styles.tableCaption}>
                                AI model pricing per million tokens
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Provider</th>
                                    <th scope="col">Model</th>
                                    <th scope="col">Input (per 1M)</th>
                                    <th scope="col">Output (per 1M)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(AI_MODELS).map(([key, provider]) => (
                                    provider.models.map((model, i) => (
                                        <tr key={`${key}-${i}`}>
                                            {i === 0 && (
                                                <td rowSpan={provider.models.length} className={styles.toolName}>
                                                    <span className={styles.logo}>
                                                        {getAIIcon(provider.iconName)}
                                                    </span>
                                                    <strong>{provider.name}</strong>
                                                </td>
                                            )}
                                            <td>{model.name}</td>
                                            <td className={styles.price}>${model.input.toFixed(2)}</td>
                                            <td className={styles.price}>${model.output.toFixed(2)}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Tips Section */}
                <section className={styles.section}>
                    <h2>Cost Optimization Tips</h2>
                    <div className={styles.tips}>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}>
                                <TargetIcon size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Start Small</h4>
                                <p>Begin with free tiers to validate your automation before scaling up.</p>
                            </div>
                        </div>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}>
                                <TrendingUpIcon size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Monitor Usage</h4>
                                <p>Track task counts closely in the first month to pick the right tier.</p>
                            </div>
                        </div>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}>
                                <BrainIcon size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Optimize AI Calls</h4>
                                <p>Use smaller models like GPT-4o-mini or Gemini Flash for simpler tasks.</p>
                            </div>
                        </div>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}>
                                <RefreshIcon size={20} />
                            </div>
                            <div className={styles.tipContent}>
                                <h4>Batch Operations</h4>
                                <p>Combine multiple steps into single runs to reduce operation counts.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Disclaimer */}
                <p className={styles.disclaimer}>
                    * Pricing data is approximate as of December 2024. Always verify with official sources.
                </p>
            </div>
        </div>
    );
}

