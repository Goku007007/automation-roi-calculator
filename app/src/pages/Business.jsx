import { useState, useEffect, useRef } from 'react';
import { ChartBarIcon, WrenchIcon, RocketIcon, CheckCircleIcon, MailIcon } from '../components/ui/Icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import styles from './Business.module.css';

// reCAPTCHA site key (production)
const RECAPTCHA_SITE_KEY = '6LenTj0sAAAAADNmBCx4Afd7SZeF2IBIHicyO22R';

// Anti-spam email protection with multiple layers:
// 1. CSS text reversal (works without JS)
// 2. JavaScript obfuscation (assembles email client-side)
// 3. No plaintext email in HTML source
function ProtectedEmail() {
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
    // This works even if JavaScript is disabled
    return (
        <a
            ref={linkRef}
            href="#"
            className={`${styles.emailLink} ${!isReady ? styles.emailReversed : ''}`}
            aria-label="Send email"
            data-email-reversed="true"
        >
            {/* Reversed email for CSS-only fallback: moc.liamg@sreerac.ukog */}
            <span className={styles.emailFallback}>moc.liamg@sreerac.ukog</span>
        </a>
    );
}

export default function Business() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        employees: '11-50',
        message: '',
        // Honeypot field - if filled, submission is from a bot
        website: '',
    });
    const [status, setStatus] = useState(null); // null, 'submitting', 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Honeypot check - bots will fill this hidden field
        if (formData.website) {
            // Silently reject but show success to not tip off bots
            setStatus('success');
            return;
        }

        setStatus('submitting');

        try {
            // Execute reCAPTCHA v3 (invisible) with timeout
            let recaptchaToken = null;
            if (window.grecaptcha) {
                try {
                    recaptchaToken = await Promise.race([
                        new Promise((resolve, reject) => {
                            window.grecaptcha.ready(() => {
                                window.grecaptcha
                                    .execute(RECAPTCHA_SITE_KEY, { action: 'contact_form' })
                                    .then(resolve)
                                    .catch(reject);
                            });
                        }),
                        // Timeout after 5 seconds
                        new Promise((_, reject) =>
                            setTimeout(() => reject(new Error('reCAPTCHA timeout')), 5000)
                        )
                    ]);
                } catch (recaptchaError) {
                    console.warn('reCAPTCHA failed, continuing without verification:', recaptchaError);
                }
            }

            console.log('reCAPTCHA token:', recaptchaToken ? 'Generated' : 'Failed/Skipped');

            // Simulate form submission (stores locally for demo)
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Store in localStorage for demo purposes
            const submissions = JSON.parse(localStorage.getItem('business-inquiries') || '[]');
            submissions.push({
                ...formData,
                recaptchaVerified: !!recaptchaToken,
                id: crypto.randomUUID(),
                submittedAt: new Date().toISOString(),
            });
            localStorage.setItem('business-inquiries', JSON.stringify(submissions));

            setStatus('success');
            setFormData({ name: '', email: '', company: '', employees: '', message: '', website: '' });
        } catch (error) {
            console.error('Form submission error:', error);
            setStatus('error');
        }
    };

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

                {/* Contact Form */}
                <div className={styles.formSection}>
                    <h2>Get in Touch</h2>

                    {status === 'success' ? (
                        <div className={styles.success}>
                            <span className={styles.successIcon}>
                                <CheckCircleIcon size={32} />
                            </span>
                            <h3>Message Sent!</h3>
                            <p>Thanks! We'll be in touch within 24 hours.</p>
                            <Button
                                variant="secondary"
                                onClick={() => setStatus(null)}
                            >
                                Send Another Message
                            </Button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            {/* Honeypot field - hidden from real users, bots will fill it */}
                            <div aria-hidden="true" style={{
                                position: 'absolute',
                                left: '-9999px',
                                opacity: 0,
                                height: 0,
                                overflow: 'hidden'
                            }}>
                                <label htmlFor="website">Website (leave blank)</label>
                                <input
                                    type="text"
                                    id="website"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleChange}
                                    tabIndex={-1}
                                    autoComplete="off"
                                />
                            </div>

                            <div className={styles.row}>
                                <Input
                                    label="Name"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Smith"
                                    required
                                />
                                <Input
                                    label="Work Email"
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="john@company.com"
                                    required
                                />
                            </div>

                            <div className={styles.row}>
                                <Input
                                    label="Company"
                                    id="company"
                                    name="company"
                                    value={formData.company}
                                    onChange={handleChange}
                                    placeholder="Acme Corp"
                                    optional
                                />
                                <Select
                                    label="Company Size"
                                    id="employees"
                                    name="employees"
                                    value={formData.employees}
                                    onChange={handleChange}
                                    placeholder="Select..."
                                    options={[
                                        { value: '1-10', label: '1-10 employees' },
                                        { value: '11-50', label: '11-50 employees' },
                                        { value: '51-200', label: '51-200 employees' },
                                        { value: '201-1000', label: '201-1000 employees' },
                                        { value: '1000+', label: '1000+ employees' },
                                    ]}
                                    optional
                                />
                            </div>

                            <Textarea
                                label="How can we help?"
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleChange}
                                placeholder="Tell us about the processes you'd like to automate..."
                                rows={5}
                                required
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                fullWidth
                                loading={status === 'submitting'}
                                disabled={status === 'submitting'}
                            >
                                Send Message
                            </Button>
                        </form>
                    )}
                </div>

                {/* Contact Info - Email is obfuscated to prevent spam */}
                <div className={styles.contactInfo}>
                    <MailIcon size={18} />
                    <p>Or reach us directly at <ProtectedEmail /></p>
                </div>
            </div>
        </div>
    );
}

