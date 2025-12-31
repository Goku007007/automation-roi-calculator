import styles from './Skeleton.module.css';

export function Skeleton({ width = '100%', height = '20px', variant = 'text' }) {
    return (
        <div
            className={`${styles.skeleton} ${styles[variant]}`}
            style={{ width, height }}
        />
    );
}

export function MetricsSkeleton() {
    return (
        <div className={styles.metricsGrid}>
            {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className={styles.metricCard}>
                    <Skeleton width="80%" height="12px" />
                    <Skeleton width="60%" height="24px" />
                </div>
            ))}
        </div>
    );
}

export function ResultsSkeleton() {
    return (
        <div className={styles.resultsContainer}>
            {/* Header */}
            <div className={styles.header}>
                <Skeleton width="200px" height="28px" />
                <Skeleton width="80px" height="24px" variant="badge" />
            </div>

            {/* Metrics Grid */}
            <MetricsSkeleton />

            {/* Recommendation */}
            <div className={styles.recommendation}>
                <Skeleton width="100px" height="14px" />
                <Skeleton width="100%" height="16px" />
                <Skeleton width="80%" height="16px" />
            </div>

            {/* Actions */}
            <div className={styles.actions}>
                <Skeleton width="160px" height="40px" variant="button" />
                <Skeleton width="120px" height="40px" variant="button" />
            </div>
        </div>
    );
}
