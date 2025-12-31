import styles from './Results.module.css';

function formatCurrency(value) {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function Results({ data, onDownloadPDF, isDownloading }) {
    if (!data) return null;

    const priorityClass = {
        High: styles.priorityHigh,
        Medium: styles.priorityMedium,
        Low: styles.priorityLow,
    }[data.priority_score] || '';

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
                </div>
                <div className={`${styles.metric} ${styles.highlight}`}>
                    <span className={styles.label}>Net Annual Savings</span>
                    <span className={styles.value}>{formatCurrency(data.net_annual_savings || data.annual_savings)}</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.label}>Payback Period</span>
                    <span className={styles.value}>{data.payback_months} mo</span>
                </div>
                <div className={`${styles.metric} ${styles.highlightBlue}`}>
                    <span className={styles.label}>ROI</span>
                    <span className={styles.value}>{data.roi_percentage}%</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.label}>5-Year Net Savings</span>
                    <span className={styles.value}>{formatCurrency(data.five_year_savings)}</span>
                </div>
                <div className={styles.metric}>
                    <span className={styles.label}>Implementation Cost</span>
                    <span className={styles.value}>{formatCurrency(data.implementation_cost)}</span>
                </div>
            </div>

            {/* Recommendation */}
            <div className={styles.recommendation}>
                <h4>Recommendation</h4>
                <p>{data.recommendation}</p>
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <button
                    className={styles.downloadBtn}
                    onClick={onDownloadPDF}
                    disabled={isDownloading}
                >
                    {isDownloading ? 'Generating...' : 'Download PDF Report'}
                </button>
            </div>
        </div>
    );
}
