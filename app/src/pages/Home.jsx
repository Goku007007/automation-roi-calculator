import { Link } from 'react-router-dom';
import styles from './Home.module.css';

export default function Home() {
    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>
                    Calculate Your<br />
                    <span className={styles.accent}>Automation ROI</span>
                </h1>
                <p className={styles.subtitle}>
                    Make data-driven decisions for your automation investments.
                    Build credible business cases with transparent assumptions.
                </p>
                <div className={styles.cta}>
                    <Link to="/calculator" className={styles.primaryBtn}>
                        Start Calculating
                    </Link>
                    <Link to="/playground" className={styles.secondaryBtn}>
                        Try Playground
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className={styles.features}>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>📊</div>
                    <h3>ROI Calculator</h3>
                    <p>Calculate payback, savings, and compare scenarios with transparent formulas.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>🎮</div>
                    <h3>Playground</h3>
                    <p>Simulate automation scenarios with common tools and estimate costs.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>📚</div>
                    <h3>Documentation</h3>
                    <p>Complete reference for tool costs, AI models, and pricing structures.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>💼</div>
                    <h3>For Business</h3>
                    <p>Need custom automation? We help build solutions tailored to your needs.</p>
                </div>
            </section>

            {/* Stats Section */}
            <section className={styles.stats}>
                <div className={styles.stat}>
                    <span className={styles.statValue}>70%</span>
                    <span className={styles.statLabel}>Avg Labor Reduction</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>6mo</span>
                    <span className={styles.statLabel}>Typical Payback</span>
                </div>
                <div className={styles.stat}>
                    <span className={styles.statValue}>5x</span>
                    <span className={styles.statLabel}>5-Year ROI</span>
                </div>
            </section>
        </div>
    );
}
