import { CheckCircleIcon, ClockIcon, TargetIcon, RefreshIcon } from '../ui/Icons';
import styles from './WhatIsAutomation.module.css';

export default function WhatIsAutomation() {
    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <h2 className={styles.title}>What is Automation?</h2>
                <p className={styles.definition}>
                    Automation replaces manual, repetitive steps with software that runs on a schedule
                    or trigger. No human clicking required. It's how teams do more with less.
                </p>
                <ul className={styles.benefits}>
                    <li>
                        <CheckCircleIcon size={18} className={styles.icon} />
                        <span>Reduce errors from copy-paste and manual data entry</span>
                    </li>
                    <li>
                        <ClockIcon size={18} className={styles.icon} />
                        <span>Free your team for higher-value work</span>
                    </li>
                    <li>
                        <RefreshIcon size={18} className={styles.icon} />
                        <span>Get consistent results every time</span>
                    </li>
                </ul>
            </div>
        </section>
    );
}
