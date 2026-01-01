import { FileTextIcon, CalculatorIcon, TrendingUpIcon } from '../ui/Icons';
import styles from './HowItWorks.module.css';

const steps = [
    {
        icon: FileTextIcon,
        number: '1',
        title: 'Describe Your Process',
        description: 'Tell us what task you want to automate and how often it runs.',
    },
    {
        icon: CalculatorIcon,
        number: '2',
        title: 'Enter Your Numbers',
        description: 'Add time per task, people involved, and hourly cost.',
    },
    {
        icon: TrendingUpIcon,
        number: '3',
        title: 'Get Savings + Payback',
        description: 'See monthly savings, annual ROI, and payback period instantly.',
    },
];

export default function HowItWorks() {
    return (
        <section className={styles.section}>
            <h2 className={styles.title}>How It Works</h2>
            <div className={styles.steps}>
                {steps.map((step) => {
                    const IconComponent = step.icon;
                    return (
                        <div key={step.number} className={styles.step}>
                            <div className={styles.stepNumber}>{step.number}</div>
                            <div className={styles.stepIcon}>
                                <IconComponent size={24} />
                            </div>
                            <h3 className={styles.stepTitle}>{step.title}</h3>
                            <p className={styles.stepDescription}>{step.description}</p>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
