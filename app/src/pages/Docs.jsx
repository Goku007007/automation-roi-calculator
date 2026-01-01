import { TOOLS, AI_MODELS, MODEL_CAPABILITIES, COST_STRATEGIES, PRICING_LAST_UPDATED } from '../utils/toolPricing';
import {
    ZapierIcon, MakeIcon, N8nIcon, PowerAutomateIcon,
    OpenAIIcon, AnthropicIcon, GoogleIcon, XAIIcon, CohereIcon,
    TargetIcon, TrendingUpIcon, BrainIcon, RefreshIcon,
    ExternalLinkIcon, CheckCircleIcon, XCircleIcon, AlertTriangleIcon
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
    XAIIcon,
    CohereIcon,
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
                    <h1>Pricing & Documentation</h1>
                    <p className={styles.subtitle}>
                        Authoritative pricing reference for automation platforms and AI models.
                    </p>
                    <p className={styles.lastUpdated}>
                        Last updated: {PRICING_LAST_UPDATED}
                    </p>
                </div>

                {/* Quick Definitions */}
                <section className={styles.section}>
                    <h2>Pricing Units (Quick Definitions)</h2>
                    <div className={styles.definitionsGrid}>
                        <div className={styles.definition}>
                            <strong>Task</strong> (Zapier): A counted unit of work inside a Zap.
                        </div>
                        <div className={styles.definition}>
                            <strong>Operation/Credit</strong> (Make): Each module execution consumes credits.
                        </div>
                        <div className={styles.definition}>
                            <strong>Workflow Execution</strong> (n8n): A run of a workflow, regardless of steps.
                        </div>
                        <div className={styles.definition}>
                            <strong>Per User/Bot</strong> (Power Automate): Licensing varies by plan type.
                        </div>
                    </div>
                </section>

                {/* Automation Tools Section */}
                <section className={styles.section}>
                    <h2>Automation Tool Pricing</h2>
                    <p className={styles.intro}>
                        Official pricing for popular automation platforms. Costs vary by tasks, operations, or executions.
                    </p>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <caption className={styles.tableCaption}>
                                Automation platform pricing comparison (official sources)
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Platform</th>
                                    <th scope="col">Tier</th>
                                    <th scope="col">Included</th>
                                    <th scope="col">Price/mo</th>
                                    <th scope="col">Notes</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(TOOLS).map(([key, tool]) => (
                                    tool.tiers.map((tier, i) => (
                                        <tr key={`${key}-${i}`}>
                                            {i === 0 && (
                                                <td rowSpan={tool.tiers.length} className={styles.toolName}>
                                                    <div className={styles.toolNameContent}>
                                                        <span className={styles.logo}>
                                                            {getToolIcon(tool.iconName)}
                                                        </span>
                                                        <div className={styles.toolInfo}>
                                                            <strong>{tool.name}</strong>
                                                            <a
                                                                href={tool.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.link}
                                                            >
                                                                <span>Official pricing</span>
                                                                <ExternalLinkIcon size={10} />
                                                            </a>
                                                        </div>
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
                                                {tier.price === 0 ? 'Free' : tier.price === 'custom' ? 'Contact' : `$${tier.price}`}
                                            </td>
                                            <td className={styles.notes}>{tier.billingNotes || '—'}</td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* AI Models Section */}
                <section className={styles.section}>
                    <h2>AI Model Pricing (USD per 1M tokens)</h2>
                    <p className={styles.intro}>
                        Token pricing for major AI providers. Input and output tokens are priced separately.
                    </p>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <caption className={styles.tableCaption}>
                                AI model pricing per million tokens (Standard tier)
                            </caption>
                            <thead>
                                <tr>
                                    <th scope="col">Provider</th>
                                    <th scope="col">Model</th>
                                    <th scope="col">Input $/1M</th>
                                    <th scope="col">Output $/1M</th>
                                    <th scope="col">Cached $/1M</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(AI_MODELS).map(([key, provider]) => (
                                    provider.models.map((model, i) => (
                                        <tr key={`${key}-${i}`} className={model.flagship ? styles.flagshipRow : model.costOptimized ? styles.cheapRow : ''}>
                                            {i === 0 && (
                                                <td rowSpan={provider.models.length} className={styles.toolName}>
                                                    <div className={styles.toolNameContent}>
                                                        <span className={styles.logo}>
                                                            {getAIIcon(provider.iconName)}
                                                        </span>
                                                        <div className={styles.toolInfo}>
                                                            <strong>{provider.name}</strong>
                                                            <a
                                                                href={provider.url}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className={styles.link}
                                                            >
                                                                <span>Official pricing</span>
                                                                <ExternalLinkIcon size={10} />
                                                            </a>
                                                        </div>
                                                    </div>
                                                </td>
                                            )}
                                            <td>
                                                {model.name}
                                                {model.flagship && <span className={styles.badge}>Flagship</span>}
                                                {model.costOptimized && <span className={styles.badgeCheap}>Budget</span>}
                                                {model.reasoning && <span className={styles.badgeReasoning}>Reasoning</span>}
                                            </td>
                                            <td className={styles.price}>${model.input.toFixed(2)}</td>
                                            <td className={styles.price}>${model.output.toFixed(2)}</td>
                                            <td className={styles.price}>
                                                {model.cachedInput ? `$${model.cachedInput.toFixed(2)}` :
                                                    model.cacheRead ? `$${model.cacheRead.toFixed(2)}` : '—'}
                                            </td>
                                        </tr>
                                    ))
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Model Capabilities */}
                <section className={styles.section}>
                    <h2>Model Capabilities Matrix</h2>
                    <p className={styles.intro}>
                        Quick reference for feature support across providers. Verify specific model endpoints before deployment.
                    </p>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th scope="col">Provider</th>
                                    <th scope="col">Tool Calling</th>
                                    <th scope="col">Structured Output</th>
                                    <th scope="col">Vision</th>
                                    <th scope="col">Audio</th>
                                    <th scope="col">Caching</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(MODEL_CAPABILITIES).map(([key, caps]) => (
                                    <tr key={key}>
                                        <td className={styles.toolName}>
                                            <div className={styles.toolNameContent}>
                                                <span className={styles.logo}>
                                                    {getAIIcon(AI_MODELS[key]?.iconName)}
                                                </span>
                                                <strong>{AI_MODELS[key]?.name || key}</strong>
                                            </div>
                                        </td>
                                        <td>{caps.toolCalling ? <CheckCircleIcon size={16} className={styles.checkIcon} /> : <XCircleIcon size={16} className={styles.xIcon} />}</td>
                                        <td>{caps.structuredOutputs ? <CheckCircleIcon size={16} className={styles.checkIcon} /> : <XCircleIcon size={16} className={styles.xIcon} />}</td>
                                        <td>{caps.vision ? <CheckCircleIcon size={16} className={styles.checkIcon} /> : <XCircleIcon size={16} className={styles.xIcon} />}</td>
                                        <td>{caps.audio ? <CheckCircleIcon size={16} className={styles.checkIcon} /> : <XCircleIcon size={16} className={styles.xIcon} />}</td>
                                        <td>{caps.promptCaching ? <CheckCircleIcon size={16} className={styles.checkIcon} /> : <XCircleIcon size={16} className={styles.xIcon} />}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* Cost Optimization */}
                <section className={styles.section}>
                    <h2>Cost Optimization Strategies</h2>

                    <div className={styles.strategyCard}>
                        <h3><TrendingUpIcon size={18} /> Model Routing (Cheap → Expensive)</h3>
                        <p>Route tasks to the cheapest model that can handle them:</p>
                        <ul className={styles.routingList}>
                            {Object.entries(COST_STRATEGIES.routingTiers.examples).map(([provider, models]) => (
                                <li key={provider}>
                                    <strong>{provider.toUpperCase()}:</strong> {models.join(' → ')}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.strategyCard}>
                        <h3><AlertTriangleIcon size={18} /> Common Cost Traps</h3>
                        <ul className={styles.trapsList}>
                            {COST_STRATEGIES.commonTraps.map((trap, i) => (
                                <li key={i}>{trap}</li>
                            ))}
                        </ul>
                    </div>

                    <div className={styles.tips}>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}><TargetIcon size={20} /></div>
                            <div className={styles.tipContent}>
                                <h4>Intent Detection</h4>
                                <p>Use cheap models (mini/flash/haiku) for classification and extraction tasks.</p>
                            </div>
                        </div>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}><BrainIcon size={20} /></div>
                            <div className={styles.tipContent}>
                                <h4>Complex Reasoning</h4>
                                <p>Reserve flagship models for long-context synthesis and critical outputs only.</p>
                            </div>
                        </div>
                        <div className={styles.tip}>
                            <div className={styles.tipIcon}><RefreshIcon size={20} /></div>
                            <div className={styles.tipContent}>
                                <h4>Prompt Caching</h4>
                                <p>Cache system prompts and tool schemas to reduce repeated token costs.</p>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Disclaimer */}
                <div className={styles.disclaimer}>
                    <strong>Disclaimer:</strong> Pricing can change frequently. Always verify current rates on official provider pages before production deployment. Rate limits are typically account-dependent and shown in provider dashboards.
                </div>
            </div>
        </div>
    );
}
