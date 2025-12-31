import { useState } from 'react';
import { ChartBarIcon, WrenchIcon, RocketIcon } from '../components/ui/Icons';
import styles from './Business.module.css';

export default function Business() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        company: '',
        employees: '11-50',
        message: '',
    });
    const [status, setStatus] = useState(null); // null, 'submitting', 'success', 'error'

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus('submitting');

        // Simulate form submission (in real app, send to backend or email service)
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Store in localStorage for demo purposes
        const submissions = JSON.parse(localStorage.getItem('business-inquiries') || '[]');
        submissions.push({
            ...formData,
            id: crypto.randomUUID(),
            submittedAt: new Date().toISOString(),
        });
        localStorage.setItem('business-inquiries', JSON.stringify(submissions));

        setStatus('success');
        setFormData({ name: '', email: '', company: '', employees: '', message: '' });
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>Need Enterprise Help?</h1>
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
                            <span className={styles.successIcon}>✓</span>
                            <h3>Message Sent!</h3>
                            <p>We'll get back to you within 24 hours.</p>
                            <button
                                className={styles.resetBtn}
                                onClick={() => setStatus(null)}
                            >
                                Send Another
                            </button>
                        </div>
                    ) : (
                        <form className={styles.form} onSubmit={handleSubmit}>
                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="name">Name *</label>
                                    <input
                                        type="text"
                                        id="name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="John Smith"
                                        required
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="email">Work Email *</label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="john@company.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className={styles.row}>
                                <div className={styles.formGroup}>
                                    <label htmlFor="company">Company</label>
                                    <input
                                        type="text"
                                        id="company"
                                        name="company"
                                        value={formData.company}
                                        onChange={handleChange}
                                        placeholder="Acme Corp"
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label htmlFor="employees">Company Size</label>
                                    <select
                                        id="employees"
                                        name="employees"
                                        value={formData.employees}
                                        onChange={handleChange}
                                    >
                                        <option value="">Select...</option>
                                        <option value="1-10">1-10 employees</option>
                                        <option value="11-50">11-50 employees</option>
                                        <option value="51-200">51-200 employees</option>
                                        <option value="201-1000">201-1000 employees</option>
                                        <option value="1000+">1000+ employees</option>
                                    </select>
                                </div>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="message">How can we help? *</label>
                                <textarea
                                    id="message"
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us about the processes you'd like to automate..."
                                    rows={5}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                className={styles.submitBtn}
                                disabled={status === 'submitting'}
                            >
                                {status === 'submitting' ? 'Sending...' : 'Send Message'}
                            </button>
                        </form>
                    )}
                </div>

                {/* Contact Info */}
                <div className={styles.contactInfo}>
                    <p>Or reach us directly at <a href="mailto:hello@automateroi.com">hello@automateroi.com</a></p>
                </div>
            </div>
        </div>
    );
}
