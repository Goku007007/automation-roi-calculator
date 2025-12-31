import { Link } from 'react-router-dom';
import { ChartBarIcon, BoltIcon, BookOpenIcon, BuildingIcon } from '../components/ui/Icons';
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
                    See exactly how much you'll save—no spreadsheets required.
                    Build credible business cases with transparent assumptions.
                </p>
                <div className={styles.cta}>
                    <Link to="/calculator" className={styles.primaryBtn}>
                        Calculate My ROI
                    </Link>
                    <Link to="/playground" className={styles.secondaryBtn}>
                        Explore Tool Costs
                    </Link>
                </div>
            </section>

            {/* Features Grid */}
            <section className={styles.features}>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <ChartBarIcon size={28} />
                    </div>
                    <h3>ROI Calculator</h3>
                    <p>Calculate payback, savings, and compare Base/Best/Worst scenarios with transparent formulas.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <BoltIcon size={28} />
                    </div>
                    <h3>Cost Playground</h3>
                    <p>Estimate monthly costs for Zapier, Make, n8n, and AI models in 30 seconds.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <BookOpenIcon size={28} />
                    </div>
                    <h3>Pricing Reference</h3>
                    <p>Complete reference for automation tool pricing and AI model costs.</p>
                </div>
                <div className={styles.feature}>
                    <div className={styles.featureIcon}>
                        <BuildingIcon size={28} />
                    </div>
                    <h3>Enterprise Help</h3>
                    <p>Need custom automation? Get tailored solutions from our team.</p>
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
