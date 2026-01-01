import { Link } from 'react-router-dom';
import { buildPrefillUrl } from '../../utils/scenarios';
import {
    ClockIcon, DollarIcon, TrendingUpIcon,
    ArrowRightIcon, CheckCircleIcon, AlertTriangleIcon,
    ReceiptIcon, UsersIcon, UserPlusIcon
} from '../ui/Icons';
import Button from '../ui/Button';
import styles from './ScenarioModule.module.css';

const categoryIcons = {
    ReceiptIcon,
    UsersIcon,
    UserPlusIcon,
};

export default function ScenarioModule({ scenario }) {
    const CategoryIcon = categoryIcons[scenario.categoryIcon];
    const prefillUrl = buildPrefillUrl(scenario);

    return (
        <div className={styles.module}>
            {/* Header */}
            <div className={styles.header}>
                <div className={styles.categoryBadge}>
                    {CategoryIcon && <CategoryIcon size={16} />}
                    <span>{scenario.category}</span>
                </div>
                <h3 className={styles.title}>{scenario.title}</h3>
                <p className={styles.description}>{scenario.description}</p>
            </div>

            {/* Before/After Split */}
            <div className={styles.comparison}>
                {/* Manual (Before) */}
                <div className={styles.workflow}>
                    <div className={styles.workflowHeader}>
                        <AlertTriangleIcon size={18} className={styles.manualIcon} />
                        <span className={styles.workflowLabel}>Manual Process</span>
                        <span className={styles.stepCount}>{scenario.manualSteps.length} steps</span>
                    </div>
                    <ul className={styles.steps}>
                        {scenario.manualSteps.map((step) => (
                            <li key={step.step} className={styles.step}>
                                <span className={styles.stepChip}>{step.step}</span>
                                <span className={styles.stepAction}>{step.action}</span>
                                <span className={styles.stepDesc}>{step.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Divider */}
                <div className={styles.divider}>
                    <ArrowRightIcon size={20} />
                </div>

                {/* Automated (After) */}
                <div className={styles.workflow}>
                    <div className={styles.workflowHeader}>
                        <CheckCircleIcon size={18} className={styles.automatedIcon} />
                        <span className={styles.workflowLabel}>Automated</span>
                        <span className={styles.stepCount}>{scenario.automatedSteps.length} steps</span>
                    </div>
                    <ul className={styles.steps}>
                        {scenario.automatedSteps.map((step) => (
                            <li key={step.step} className={`${styles.step} ${styles.automatedStep}`}>
                                <span className={styles.stepChip}>{step.step}</span>
                                <span className={styles.stepAction}>{step.action}</span>
                                <span className={styles.stepDesc}>{step.description}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Assumptions + Outputs */}
            <div className={styles.metrics}>
                <div className={styles.assumptions}>
                    <h4>Example Assumptions</h4>
                    <div className={styles.assumptionGrid}>
                        <div className={styles.assumptionItem}>
                            <span className={styles.assumptionLabel}>Volume</span>
                            <span className={styles.assumptionValue}>
                                {scenario.assumptions.volume} {scenario.assumptions.volumeUnit}
                            </span>
                        </div>
                        <div className={styles.assumptionItem}>
                            <span className={styles.assumptionLabel}>Time (manual)</span>
                            <span className={styles.assumptionValue}>
                                {scenario.assumptions.timeManualMinutes} min each
                            </span>
                        </div>
                        <div className={styles.assumptionItem}>
                            <span className={styles.assumptionLabel}>Hourly rate</span>
                            <span className={styles.assumptionValue}>
                                ${scenario.assumptions.hourlyRate}/hr
                            </span>
                        </div>
                        <div className={styles.assumptionItem}>
                            <span className={styles.assumptionLabel}>Tool cost</span>
                            <span className={styles.assumptionValue}>
                                ${scenario.assumptions.toolCostMonthly}/mo
                            </span>
                        </div>
                    </div>
                </div>

                <div className={styles.outputs}>
                    <div className={styles.outputCard}>
                        <ClockIcon size={20} />
                        <div className={styles.outputContent}>
                            <span className={styles.outputValue}>
                                {Math.round(scenario.outputs.manualHours - scenario.outputs.automatedHours)} hrs
                            </span>
                            <span className={styles.outputLabel}>saved/month</span>
                        </div>
                    </div>
                    <div className={styles.outputCard}>
                        <DollarIcon size={20} />
                        <div className={styles.outputContent}>
                            <span className={styles.outputValue}>
                                ${scenario.outputs.netSavings.toLocaleString()}
                            </span>
                            <span className={styles.outputLabel}>net savings/mo</span>
                        </div>
                    </div>
                    <div className={styles.outputCard}>
                        <TrendingUpIcon size={20} />
                        <div className={styles.outputContent}>
                            <span className={styles.outputValue}>
                                {scenario.outputs.paybackMonths === 0 ? 'Immediate' : `${scenario.outputs.paybackMonths} mo`}
                            </span>
                            <span className={styles.outputLabel}>payback</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Disclaimer + CTA */}
            <div className={styles.footer}>
                <p className={styles.disclaimer}>
                    Example assumptions only. Edit inputs in the calculator to match your numbers.
                </p>
                <Link to={prefillUrl}>
                    <Button variant="primary">
                        Try This Scenario
                        <ArrowRightIcon size={16} />
                    </Button>
                </Link>
            </div>
        </div>
    );
}
