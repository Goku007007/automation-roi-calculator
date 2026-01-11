import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { SCENARIOS } from '../utils/scenarios';
import { TEMPLATES } from '../data/templates';
import ScenarioModule from '../components/home/ScenarioModule';
import WhatIsAutomation from '../components/home/WhatIsAutomation';
import HowItWorks from '../components/home/HowItWorks';
import ReportPreview from '../components/home/ReportPreview';
import PlaygroundTeaser from '../components/home/PlaygroundTeaser';
import Button from '../components/ui/Button';
import {
    ArrowRightIcon, BookOpenIcon, BoltIcon,
    CheckCircleIcon, ShieldCheckIcon, FileTextIcon
} from '../components/ui/Icons';
import styles from './Home.module.css';

export default function Home() {
    const [activeScenario, setActiveScenario] = useState(0);
    const navigate = useNavigate();

    const categories = [
        { id: 'invoice-approval', label: 'Finance' },
        { id: 'lead-routing', label: 'Sales' },
        { id: 'onboarding', label: 'HR' },
    ];

    // Navigate to calculator with demo data and auto-calculate
    const handleSeeExample = () => {
        const demoTemplate = TEMPLATES[0]; // Invoice Processing - solid ROI example
        navigate('/calculator', {
            state: {
                loadProject: {
                    id: demoTemplate.id,
                    defaults: demoTemplate.defaults,
                    isTemplate: true,
                    autoCalculate: true, // Signal to auto-submit
                }
            }
        });
    };

    return (
        <div className={styles.page}>
            {/* Hero Section */}
            <section className={styles.hero}>
                <h1 className={styles.title}>
                    Calculate Your Automation ROI<br />
                    <span className={styles.accent}>in 60 Seconds</span>
                </h1>
                <p className={styles.subtitle}>
                    See exactly how much time and money you'll save by automating
                    repetitive tasks. No guesswork. Just transparent math.
                </p>
                <div className={styles.cta}>
                    <Link to="/calculator">
                        <Button variant="primary" size="lg">
                            <span>Calculate My ROI</span>
                            <ArrowRightIcon size={18} />
                        </Button>
                    </Link>
                    <Button variant="secondary" size="lg" onClick={handleSeeExample}>
                        <BoltIcon size={18} />
                        <span>See Example Results</span>
                    </Button>
                </div>
            </section>

            {/* What is Automation? */}
            <WhatIsAutomation />

            {/* Before/After Scenarios */}
            <section className={styles.scenariosSection}>
                <div className={styles.scenariosHeader}>
                    <h2>See Automation in Action</h2>
                    <p>Real workflows with transparent assumptions. Click any scenario to try it in the calculator.</p>
                </div>

                {/* Category Tabs */}
                <div className={styles.tabs} role="tablist" aria-label="Scenario categories">
                    {categories.map((cat, index) => (
                        <button
                            key={cat.id}
                            role="tab"
                            aria-selected={activeScenario === index}
                            className={`${styles.tab} ${activeScenario === index ? styles.tabActive : ''}`}
                            onClick={() => setActiveScenario(index)}
                        >
                            {cat.label}
                        </button>
                    ))}
                </div>

                {/* Active Scenario */}
                <div className={styles.scenarioContainer}>
                    <ScenarioModule scenario={SCENARIOS[activeScenario]} />
                </div>
            </section>

            {/* How It Works */}
            <HowItWorks />

            {/* PDF Report Preview */}
            <ReportPreview />

            {/* Playground Teaser */}
            <PlaygroundTeaser />

            {/* Trust Signals */}
            <section className={styles.trustSection}>
                <div className={styles.trustSignals}>
                    <div className={styles.trustItem}>
                        <CheckCircleIcon size={20} />
                        <span>Transparent assumptions (edit any input)</span>
                    </div>
                    <div className={styles.trustItem}>
                        <ShieldCheckIcon size={20} />
                        <span>Audit-friendly PDF exports</span>
                    </div>
                    <div className={styles.trustItem}>
                        <FileTextIcon size={20} />
                        <span>No spreadsheets required</span>
                    </div>
                </div>
            </section>
        </div>
    );
}
