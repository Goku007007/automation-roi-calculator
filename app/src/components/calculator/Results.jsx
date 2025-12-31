import { useState } from 'react';
import Spinner from '../ui/Spinner';
import styles from './Results.module.css';

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// Benchmarks for interpretation
const BENCHMARKS = {
    roi: { good: 200, excellent: 400 },
    payback: { good: 12, excellent: 6 },
};

function getBenchmarkStatus(metric, value) {
    if (metric === 'roi') {
        if (value >= BENCHMARKS.roi.excellent) return { status: 'excellent', text: 'Excellent (top tier)' };
        if (value >= BENCHMARKS.roi.good) return { status: 'good', text: 'Above average' };
        return { status: 'low', text: 'Below 200% threshold' };
    }
    if (metric === 'payback') {
        if (value <= BENCHMARKS.payback.excellent) return { status: 'excellent', text: 'Excellent (< 6 mo)' };
        if (value <= BENCHMARKS.payback.good) return { status: 'good', text: 'Within 1 year' };
        return { status: 'low', text: 'Long payback period' };
    }
    return null;
}

export default function Results({ data, onDownloadPDF, isDownloading }) {
    const [showMethodology, setShowMethodology] = useState(false);

    if (!data) return null;

    const priorityClass = {
        High: styles.priorityHigh,
        Medium: styles.priorityMedium,
        Low: styles.priorityLow,
    }[data.priority_score] || '';

    const roiBenchmark = getBenchmarkStatus('roi', data.roi_percentage);
    const paybackBenchmark = getBenchmarkStatus('payback', data.payback_months);

    return (
        <div className={styles.results}>
            <div className={styles.header}>
                <h2>{data.process_name}</h2>
                <span className={`${styles.priority} ${priorityClass}`}>
                    {data.priority_score} Priority
                </span>
            </div>

            {/* Metrics Grid */}
            <div className={styles.metrics}>
                <div className={styles.metric}>
                    <span className={styles.label}>Annual Labor Cost</span>
                    <span className={styles.value}>{formatCurrency(data.annual_labor_cost)}</span>
                    <span className={styles.helper}>Current manual cost</span>
                </div>
                <div className={`${styles.metric} ${styles.highlight}`}>
                    <span className={styles.label}>Net Annual Savings</span>
                    <span className={styles.value}>{formatCurrency(data.net_annual_savings || data.annual_savings)}</span>
                    <span className={styles.helper}>After automation costs</span>
                </div>
                <div className={`${styles.metric} ${styles[paybackBenchmark?.status]}`}>
                    <span className={styles.label}>Payback Period</span>
                    <span className={styles.value}>{data.payback_months} mo</span>
                    <span className={styles.benchmark}>{paybackBenchmark?.text}</span>
                </div>
                <div className={`${styles.metric} ${styles.highlightBlue} ${styles[roiBenchmark?.status]}`}>
                    <span className={styles.label}>ROI</span>
                    <span className={styles.value}>{data.roi_percentage}%</span>
                    <span className={styles.benchmark}>{roiBenchmark?.text}</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.label}>5-Year Net Savings</span>
                    <span className={styles.value}>{formatCurrency(data.five_year_savings)}</span>
                    <span className={styles.helper}>Projected total benefit</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.label}>Implementation Cost</span>
                    <span className={styles.value}>{formatCurrency(data.implementation_cost)}</span>
                    <span className={styles.helper}>One-time investment</span>
                </div>
            </div>

            {/* Recommendation */}
            <div className={styles.recommendation}>
                <h4>Recommendation</h4>
                <p>{data.recommendation}</p>
            </div>

            {/* Methodology Link */}
            <button
                className={styles.methodologyBtn}
                onClick={() => setShowMethodology(!showMethodology)}
                type="button"
            >
                {showMethodology ? 'Hide' : 'How is this calculated?'}
            </button>

            {showMethodology && (
                <div className={styles.methodology}>
                    <h4>Calculation Methodology</h4>
                    <ul>
                        <li><strong>Annual Labor Cost</strong> = Hours/run × Runs/period × Staff × Hourly rate × Periods/year</li>
                        <li><strong>Annual Savings</strong> = Labor Cost × Expected reduction %</li>
                        <li><strong>Net Savings</strong> = Savings − License − Maintenance costs</li>
                        <li><strong>ROI</strong> = (Net Savings / Implementation Cost) × 100</li>
                        <li><strong>Payback</strong> = Implementation Cost / (Net Savings / 12)</li>
                        <li><strong>5-Year</strong> = (Net Savings × 5) − Implementation Cost</li>
                    </ul>
                    <p className={styles.disclaimer}>
                        * Projections assume consistent volumes. Actual results may vary.
                    </p>
                </div>
            )}

            {/* Actions */}
            <div className={styles.actions}>
                <button
                    className={styles.downloadBtn}
                    onClick={onDownloadPDF}
                    disabled={isDownloading}
                >
                    {isDownloading ? (
                        <>
                            <Spinner size="sm" light />
                            <span>Generating...</span>
                        </>
                    ) : (
                        'Download Report (PDF)'
                    )}
                </button>
            </div>
        </div>
    );
}
