import { useState } from 'react';
import { ChartBarIcon, WrenchIcon, RocketIcon, CheckCircleIcon } from '../components/ui/Icons';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
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

                {/* Contact Info */}
                <div className={styles.contactInfo}>
                    <p>Or reach us directly at <a href="mailto:hello@automateroi.com">hello@automateroi.com</a></p>
                </div>
            </div>
        </div>
    );
}
