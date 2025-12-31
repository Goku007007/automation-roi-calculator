import { useState } from 'react';
import ToolCard from '../components/playground/ToolCard';
import CostSimulator from '../components/playground/CostSimulator';
import { TOOLS } from '../utils/toolPricing';
import styles from './Playground.module.css';

export default function Playground() {
    const [selectedTool, setSelectedTool] = useState('zapier');

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Playground</h1>
                    <p className={styles.subtitle}>
                        Simulate automation scenarios and estimate costs with common tools.
                    </p>
                </div>

                {/* Tool Selection Grid */}
                <section className={styles.section}>
                    <h2 className={styles.sectionTitle}>Select a Tool</h2>
                    <div className={styles.toolGrid}>
                        {Object.entries(TOOLS).map(([key, tool]) => (
                            <ToolCard
                                key={key}
                                tool={tool}
                                isSelected={selectedTool === key}
                                onSelect={() => setSelectedTool(key)}
                            />
                        ))}
                    </div>
                </section>

                {/* Cost Simulator */}
                <section className={styles.section}>
                    <CostSimulator selectedTool={selectedTool} />
                </section>

                {/* Tool Details */}
                {selectedTool && TOOLS[selectedTool] && (
                    <section className={styles.section}>
                        <div className={styles.details}>
                            <h3>Pricing Tiers</h3>
                            <table className={styles.tierTable}>
                                <thead>
                                    <tr>
                                        <th>Tier</th>
                                        <th>Included</th>
                                        <th>Price</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {TOOLS[selectedTool].tiers.map((tier, i) => (
                                        <tr key={i}>
                                            <td>{tier.name}</td>
                                            <td>
                                                {tier.tasks?.toLocaleString() || tier.operations?.toLocaleString() || tier.executions || '—'}
                                                {tier.tasks ? ' tasks' : tier.operations ? ' ops' : tier.executions ? ' exec' : ''}
                                            </td>
                                            <td>
                                                {tier.price === 0 ? 'Free' : tier.price === 'custom' ? 'Custom' : `$${tier.price}/mo`}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <a
                                href={TOOLS[selectedTool].url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className={styles.pricingLink}
                            >
                                View official pricing →
                            </a>
                        </div>
                    </section>
                )}

                {/* Disclaimer */}
                <p className={styles.disclaimer}>
                    * Pricing data is approximate and may not reflect current rates.
                    Always verify with official sources before making decisions.
                </p>
            </div>
        </div>
    );
}
