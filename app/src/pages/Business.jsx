import { useState, useEffect, useRef } from 'react';
import { ChartBarIcon, WrenchIcon, RocketIcon, MailIcon } from '../components/ui/Icons';
import styles from './Business.module.css';

// Anti-spam email protection with multiple layers:
// 1. CSS text reversal (works without JS)
// 2. JavaScript obfuscation (assembles email client-side)
// 3. No plaintext email in HTML source
function ProtectedEmail({ large = false }) {
    const linkRef = useRef(null);
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        // Assemble email only on client-side to prevent bot scraping
        // Email: goku.careers@gmail.com (split and reversed)
        const user = ['ukog', 'sreerac'].map(p => p.split('').reverse().join('')).join('.');
        const domain = ['liamg', 'moc'].map(p => p.split('').reverse().join('')).join('.');
        const email = `${user}@${domain}`;

        if (linkRef.current) {
            linkRef.current.href = `mailto:${email}`;
            linkRef.current.textContent = email;
            setIsReady(true);
        }
    }, []);

    // CSS-only fallback: email is written backwards in HTML, CSS reverses it visually
    return (
        <a
            ref={linkRef}
            href="#"
            className={`${styles.emailLink} ${large ? styles.emailLarge : ''} ${!isReady ? styles.emailReversed : ''}`}
            aria-label="Send email"
        >
            <span className={styles.emailFallback}>moc.liamg@sreerac.ukog</span>
        </a>
    );
}

export default function Business() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Enterprise Automation Solutions</h1>
                    <p className={styles.subtitle}>
                        Need custom automation solutions? Let's discuss how we can help transform your operations.
                    </p>
                </div>

                {/* Value Props */}
                <div className={styles.valueProps}>
                    <div className={styles.prop}>
                        <span className={styles.icon}><ChartBarIcon size={24} /></span>
                        <h3>Data-Driven</h3>
                        <p>We calculate ROI before building, ensuring every automation delivers value.</p>
                    </div>
                    <div className={styles.prop}>
                        <span className={styles.icon}><WrenchIcon size={24} /></span>
                        <h3>Custom Solutions</h3>
                        <p>Tailored automations built for your specific workflows and systems.</p>
                    </div>
                    <div className={styles.prop}>
                        <span className={styles.icon}><RocketIcon size={24} /></span>
                        <h3>Quick Launch</h3>
                        <p>From assessment to deployment in weeks, not months.</p>
                    </div>
                </div>

                {/* Beautiful Contact Section */}
                <div className={styles.contactSection}>
                    <div className={styles.contactCard}>
                        <div className={styles.contactGlow}></div>
                        <div className={styles.contactContent}>
                            <div className={styles.contactIconWrapper}>
                                <MailIcon size={32} />
                            </div>
                            <h2>Let's Build Something Amazing</h2>
                            <p className={styles.contactDescription}>
                                Ready to automate your workflows? Reach out and let's discuss how we can help transform your operations.
                            </p>
                            <div className={styles.emailWrapper}>
                                <ProtectedEmail large />
                            </div>
                            <p className={styles.responseTime}>
                                We typically respond within 24 hours
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
