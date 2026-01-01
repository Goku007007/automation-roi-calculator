import { Link } from 'react-router-dom';
import {
    ShoppingCartIcon, UploadIcon, StarIcon, TagIcon, ShieldCheckIcon,
    DollarIcon, TrendingUpIcon, UsersIcon, ChartBarIcon, LinkIcon
} from '../components/ui/Icons';
import Button from '../components/ui/Button';
import styles from './Marketplace.module.css';

export default function Marketplace() {
    return (
        <div className={styles.page}>
            {/* Hero */}
            <section className={styles.hero}>
                <div className={styles.badge}>Coming Soon</div>
                <h1 className={styles.title}>
                    Automation Template<br />
                    <span className={styles.accent}>Marketplace</span>
                </h1>
                <p className={styles.subtitle}>
                    Buy ready-to-use automation workflows or sell your own templates
                    to thousands of automation builders.
                </p>
            </section>

            {/* How It Works */}
            <section className={styles.howItWorks}>
                <h2>How It Works</h2>
                <div className={styles.cards}>
                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <ShoppingCartIcon size={28} />
                        </div>
                        <h3>Buy Templates</h3>
                        <p>
                            Browse verified automation workflows for invoice processing,
                            lead routing, onboarding, and more. Deploy in minutes.
                        </p>
                        <ul className={styles.features}>
                            <li><StarIcon size={14} /> Verified by community</li>
                            <li><ShieldCheckIcon size={14} /> Tested and documented</li>
                            <li><TagIcon size={14} /> Transparent pricing</li>
                        </ul>
                    </div>

                    <div className={styles.card}>
                        <div className={styles.cardIcon}>
                            <UploadIcon size={28} />
                        </div>
                        <h3>Sell Templates</h3>
                        <p>
                            Monetize your automation expertise. Package your workflows
                            as templates and earn passive income from every sale.
                        </p>
                        <ul className={styles.features}>
                            <li><StarIcon size={14} /> Keep 80% of revenue</li>
                            <li><ShieldCheckIcon size={14} /> Built-in licensing</li>
                            <li><TagIcon size={14} /> Analytics dashboard</li>
                        </ul>
                    </div>
                </div>
            </section>

            {/* Categories Preview */}
            <section className={styles.categories}>
                <h2>Template Categories</h2>
                <div className={styles.categoryGrid}>
                    <div className={styles.categoryCard}>
                        <DollarIcon size={20} className={styles.categoryIcon} />
                        <span>Finance & Accounting</span>
                    </div>
                    <div className={styles.categoryCard}>
                        <TrendingUpIcon size={20} className={styles.categoryIcon} />
                        <span>Sales & CRM</span>
                    </div>
                    <div className={styles.categoryCard}>
                        <UsersIcon size={20} className={styles.categoryIcon} />
                        <span>HR & Onboarding</span>
                    </div>
                    <div className={styles.categoryCard}>
                        <ShoppingCartIcon size={20} className={styles.categoryIcon} />
                        <span>E-commerce</span>
                    </div>
                    <div className={styles.categoryCard}>
                        <ChartBarIcon size={20} className={styles.categoryIcon} />
                        <span>Reporting & Analytics</span>
                    </div>
                    <div className={styles.categoryCard}>
                        <LinkIcon size={20} className={styles.categoryIcon} />
                        <span>API & Integrations</span>
                    </div>
                </div>
            </section>

            {/* Waitlist CTA */}
            <section className={styles.waitlist}>
                <h2>Be the First to Know</h2>
                <p>
                    Join the waitlist to get early access when the Marketplace launches.
                </p>
                <div className={styles.waitlistForm}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        className={styles.emailInput}
                        disabled
                    />
                    <Button variant="primary" disabled>
                        Join Waitlist
                    </Button>
                </div>
                <p className={styles.comingSoon}>Launching Q2 2025</p>
            </section>
        </div>
    );
}
