import { TOOLS, AI_MODELS } from '../utils/toolPricing';
import styles from './Docs.module.css';

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
                            <thead>
                                <tr>
                                    <th>Tool</th>
                                    <th>Tier</th>
                                    <th>Included</th>
                                    <th>Price/mo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(TOOLS).map(([key, tool]) => (
                                    tool.tiers.map((tier, i) => (
                                        <tr key={`${key}-${i}`}>
                                            {i === 0 && (
                                                <td rowSpan={tool.tiers.length} className={styles.toolName}>
                                                    <span className={styles.logo}>{tool.logo}</span>
                                                    <div>
                                                        <strong>{tool.name}</strong>
                                                        <a href={tool.url} target="_blank" rel="noopener noreferrer" className={styles.link}>
                                                            Official pricing →
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
                            <thead>
                                <tr>
                                    <th>Provider</th>
                                    <th>Model</th>
                                    <th>Input (per 1M)</th>
                                    <th>Output (per 1M)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(AI_MODELS).map(([key, provider]) => (
                                    provider.models.map((model, i) => (
                                        <tr key={`${key}-${i}`}>
                                            {i === 0 && (
                                                <td rowSpan={provider.models.length} className={styles.toolName}>
                                                    <span className={styles.logo}>{provider.logo}</span>
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
                            <h4>🎯 Start Small</h4>
                            <p>Begin with free tiers to validate your automation before scaling up.</p>
                        </div>
                        <div className={styles.tip}>
                            <h4>📊 Monitor Usage</h4>
                            <p>Track task counts closely in the first month to pick the right tier.</p>
                        </div>
                        <div className={styles.tip}>
                            <h4>🧠 Optimize AI Calls</h4>
                            <p>Use smaller models like GPT-4o-mini or Gemini Flash for simpler tasks.</p>
                        </div>
                        <div className={styles.tip}>
                            <h4>🔄 Batch Operations</h4>
                            <p>Combine multiple steps into single runs to reduce operation counts.</p>
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
