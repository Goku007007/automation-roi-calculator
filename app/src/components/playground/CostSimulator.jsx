import { useState } from 'react';
import { TOOLS, AI_MODELS, calculateToolCost, calculateAICost } from '../../utils/toolPricing';
import styles from './CostSimulator.module.css';

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(value);
}

export default function CostSimulator({ selectedTool }) {
    const [monthlyTasks, setMonthlyTasks] = useState(5000);
    const [includeAI, setIncludeAI] = useState(false);
    const [aiProvider, setAiProvider] = useState('openai');
    const [aiModel, setAiModel] = useState('GPT-4o-mini');
    const [monthlyTokens, setMonthlyTokens] = useState(1000000);

    const tool = TOOLS[selectedTool];
    const toolCost = tool ? calculateToolCost(selectedTool, monthlyTasks) : null;

    let aiCost = null;
    if (includeAI) {
        aiCost = calculateAICost(aiProvider, aiModel, monthlyTokens, monthlyTokens * 0.5);
    }

    const totalMonthlyCost = (toolCost?.monthlyCost || 0) + (aiCost?.totalCost || 0);
    const totalAnnualCost = totalMonthlyCost * 12;

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Cost Simulator</h3>

            {/* Task Volume */}
            <div className={styles.section}>
                <label className={styles.label}>
                    Monthly Tasks/Operations
                </label>
                <div className={styles.sliderWithInput}>
                    <input
                        type="range"
                        className={styles.slider}
                        min="100"
                        max="100000"
                        step="100"
                        value={monthlyTasks}
                        onChange={(e) => setMonthlyTasks(Number(e.target.value))}
                    />
                    <input
                        type="number"
                        className={styles.numberInput}
                        min="100"
                        max="100000"
                        value={monthlyTasks}
                        onChange={(e) => setMonthlyTasks(Math.max(100, Math.min(100000, Number(e.target.value) || 100)))}
                    />
                </div>
                <div className={styles.rangeLabels}>
                    <span>100</span>
                    <span>100K</span>
                </div>
            </div>

            {/* Tool Cost Result */}
            {toolCost && (
                <div className={styles.result}>
                    <div className={styles.resultRow}>
                        <span>{tool.name} ({toolCost.tier})</span>
                        <span className={styles.cost}>{formatCurrency(toolCost.monthlyCost)}/mo</span>
                    </div>
                    {toolCost.overage > 0 && (
                        <div className={styles.resultRow}>
                            <span className={styles.muted}>Overage charges</span>
                            <span className={styles.muted}>{formatCurrency(toolCost.overage)}</span>
                        </div>
                    )}
                </div>
            )}

            {/* AI Add-on Toggle */}
            <div className={styles.toggle}>
                <label className={styles.toggleLabel}>
                    <input
                        type="checkbox"
                        checked={includeAI}
                        onChange={(e) => setIncludeAI(e.target.checked)}
                    />
                    <span>Include AI Model Costs</span>
                </label>
            </div>

            {/* AI Configuration */}
            {includeAI && (
                <div className={styles.aiConfig}>
                    <div className={styles.row}>
                        <div className={styles.field}>
                            <label>Provider</label>
                            <select
                                value={aiProvider}
                                onChange={(e) => {
                                    setAiProvider(e.target.value);
                                    setAiModel(AI_MODELS[e.target.value].models[0].name);
                                }}
                            >
                                {Object.entries(AI_MODELS).map(([key, data]) => (
                                    <option key={key} value={key}>{data.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.field}>
                            <label>Model</label>
                            <select value={aiModel} onChange={(e) => setAiModel(e.target.value)}>
                                {AI_MODELS[aiProvider].models.map(model => (
                                    <option key={model.name} value={model.name}>{model.name}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div className={styles.section}>
                        <label className={styles.label}>
                            Monthly Input Tokens
                            <span className={styles.value}>{(monthlyTokens / 1000000).toFixed(1)}M</span>
                        </label>
                        <input
                            type="range"
                            className={styles.slider}
                            min="100000"
                            max="50000000"
                            step="100000"
                            value={monthlyTokens}
                            onChange={(e) => setMonthlyTokens(Number(e.target.value))}
                        />
                    </div>

                    {aiCost && (
                        <div className={styles.result}>
                            <div className={styles.resultRow}>
                                <span>{aiCost.model} Usage</span>
                                <span className={styles.cost}>{formatCurrency(aiCost.totalCost)}/mo</span>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Total */}
            <div className={styles.total}>
                <div className={styles.totalRow}>
                    <span>Monthly Total</span>
                    <span className={styles.totalCost}>{formatCurrency(totalMonthlyCost)}</span>
                </div>
                <div className={styles.totalRow}>
                    <span className={styles.muted}>Annual Total</span>
                    <span className={styles.annualCost}>{formatCurrency(totalAnnualCost)}</span>
                </div>
            </div>
        </div>
    );
}
