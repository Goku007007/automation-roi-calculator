import styles from './ScenarioCompare.module.css';

function formatCurrency(value) {
    if (value === undefined || value === null) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

const METRICS = [
    { key: 'net_annual_savings', label: 'Net Annual Savings', format: 'currency', fallback: 'annual_savings' },
    { key: 'payback_months', label: 'Payback Period', format: 'months' },
    { key: 'roi_percentage', label: 'ROI', format: 'percent' },
    { key: 'five_year_savings', label: '5-Year Net Savings', format: 'currency' },
    { key: 'implementation_cost', label: 'Implementation Cost', format: 'currency' },
];

export default function ScenarioCompare({ scenarios }) {
    if (!scenarios) return null;

    const hasMultiple = Object.keys(scenarios).filter(k => scenarios[k]).length > 1;
    if (!hasMultiple) return null;

    const formatValue = (value, format, data, fallback) => {
        const val = value ?? (fallback && data?.[fallback]);
        if (val === undefined || val === null) return '—';

        switch (format) {
            case 'currency':
                return formatCurrency(val);
            case 'months':
                return `${val} mo`;
            case 'percent':
                return `${val}%`;
            default:
                return val;
        }
    };

    const getBestValue = (metricKey, format) => {
        const values = Object.entries(scenarios)
            .filter(([_, data]) => data?.results?.[metricKey] !== undefined)
            .map(([key, data]) => ({ key, value: data.results[metricKey] }));

        if (values.length === 0) return null;

        // For costs and payback, lower is better; for savings and ROI, higher is better
        const lowerIsBetter = metricKey === 'implementation_cost' || metricKey === 'payback_months';

        return values.reduce((best, curr) => {
            if (lowerIsBetter) {
                return curr.value < best.value ? curr : best;
            }
            return curr.value > best.value ? curr : best;
        }, values[0]).key;
    };

    return (
        <div className={styles.container}>
            <h3 className={styles.title}>Scenario Comparison</h3>

            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Metric</th>
                            <th className={scenarios.base ? '' : styles.empty}>Base</th>
                            <th className={scenarios.best ? '' : styles.empty}>Best</th>
                            <th className={scenarios.worst ? '' : styles.empty}>Worst</th>
                        </tr>
                    </thead>
                    <tbody>
                        {METRICS.map(metric => {
                            const bestScenario = getBestValue(metric.key, metric.format);

                            return (
                                <tr key={metric.key}>
                                    <td className={styles.metricLabel}>{metric.label}</td>
                                    {['base', 'best', 'worst'].map(scenario => {
                                        const data = scenarios[scenario]?.results;
                                        const value = data?.[metric.key];
                                        const isBest = bestScenario === scenario && data;

                                        return (
                                            <td
                                                key={scenario}
                                                className={`${styles.value} ${isBest ? styles.best : ''} ${!data ? styles.empty : ''}`}
                                            >
                                                {formatValue(value, metric.format, data, metric.fallback)}
                                            </td>
                                        );
                                    })}
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {/* What Must Be True Section */}
            <div className={styles.insights}>
                <h4>What Must Be True</h4>
                <ul>
                    {scenarios.best?.inputs && (
                        <li>
                            <strong>Best Case:</strong> Achieve {scenarios.best.inputs.expected_labor_reduction || 70}% labor reduction
                        </li>
                    )}
                    {scenarios.base?.inputs && (
                        <li>
                            <strong>Break-even:</strong> Need at least {Math.round((scenarios.base.inputs.implementation_cost || 0) / ((scenarios.base.results?.net_annual_savings || scenarios.base.results?.annual_savings || 1) / 12))} months of savings
                        </li>
                    )}
                    {scenarios.worst?.results && (
                        <li>
                            <strong>Risk:</strong> Even in worst case, {scenarios.worst.results.roi_percentage > 0 ? 'still positive ROI' : 'may not break even in year 1'}
                        </li>
                    )}
                </ul>
            </div>
        </div>
    );
}
