import { ReceiptIcon, UserPlusIcon, ChartBarIcon } from '../ui/Icons';
import styles from './ProcessTemplates.module.css';

/**
 * Process Templates with research-backed industry benchmarks.
 * Sources: BLS, Bottomline, BambooHR, Campaign Live research.
 */

const TEMPLATES = [
    {
        id: 'invoice-processing',
        name: 'Invoice Processing',
        IconComponent: ReceiptIcon,
        description: 'Accounts payable automation with data entry, validation, and routing.',
        category: 'Finance',
        defaults: {
            process_name: 'Invoice Processing',
            frequency: 'daily',
            runs_per_period: 20,          // ~250 invoices/month assuming daily
            hours_per_run: 0.25,          // 15 minutes per invoice (research: 10-15 min)
            staff_count: 2,
            hourly_rate: 24,              // BLS median for AP clerks: $23.66
            error_rate: 5,                // Research: 2-5% error rate
            error_fix_cost: 50,           // Rework cost per error
            implementation_cost: 15000,   // Mid-range automation setup
            software_license_cost: 3600,  // $300/month typical
            annual_maintenance_cost: 1200,
            expected_labor_reduction: 75, // Research: 60-80% reduction
        },
        benchmarks: {
            timeReduction: '60-80%',
            errorReduction: '90%+',
            typicalPayback: '4-8 months',
        }
    },
    {
        id: 'employee-onboarding',
        name: 'Employee Onboarding',
        IconComponent: UserPlusIcon,
        description: 'New hire paperwork, system access, and orientation workflows.',
        category: 'HR',
        defaults: {
            process_name: 'Employee Onboarding',
            frequency: 'monthly',
            runs_per_period: 3,           // ~3 hires/month for growing SMB
            hours_per_run: 8,             // Research: 8-10 hrs per hire
            staff_count: 2,               // HR + IT typically
            hourly_rate: 35,              // BLS median for HR specialists: $35.05
            error_rate: 10,               // Compliance risk proxy
            error_fix_cost: 100,          // I-9 error remediation
            implementation_cost: 20000,   // HR system integration
            software_license_cost: 6000,  // HRIS annual cost
            annual_maintenance_cost: 2000,
            expected_labor_reduction: 50, // Research: 30-50% reduction
        },
        benchmarks: {
            timeReduction: '30-50%',
            errorReduction: '75%+',
            typicalPayback: '8-14 months',
        }
    },
    {
        id: 'monthly-reporting',
        name: 'Monthly Reporting',
        IconComponent: ChartBarIcon,
        description: 'Sales/marketing data aggregation, analysis, and report generation.',
        category: 'Operations',
        defaults: {
            process_name: 'Monthly Reporting',
            frequency: 'monthly',
            runs_per_period: 4,           // Weekly internal + monthly exec
            hours_per_run: 6,             // Research: 5-10 hrs per report
            staff_count: 1,
            hourly_rate: 37,              // BLS median for analysts: $37.00
            error_rate: 3,                // Spreadsheet error rate
            error_fix_cost: 75,           // Correction time cost
            implementation_cost: 12000,   // Dashboard/BI setup
            software_license_cost: 2400,  // Analytics tool
            annual_maintenance_cost: 1000,
            expected_labor_reduction: 65, // Research: 50-65% automatable
        },
        benchmarks: {
            timeReduction: '50-65%',
            errorReduction: '80%+',
            typicalPayback: '6-10 months',
        }
    },
];

export default function ProcessTemplates({ onSelectTemplate, selectedId }) {
    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Quick Start Templates</h3>
                <p>Select a common process to pre-fill with industry benchmarks</p>
            </div>

            <div className={styles.grid}>
                {TEMPLATES.map(template => (
                    <button
                        key={template.id}
                        className={`${styles.card} ${selectedId === template.id ? styles.selected : ''}`}
                        onClick={() => onSelectTemplate(template)}
                        type="button"
                    >
                        <div className={styles.cardHeader}>
                            <span className={styles.icon}>
                                <template.IconComponent size={24} />
                            </span>
                            <span className={styles.category}>{template.category}</span>
                        </div>
                        <h4 className={styles.title}>{template.name}</h4>
                        <p className={styles.description}>{template.description}</p>
                        <div className={styles.benchmarks}>
                            <div className={styles.benchmark}>
                                <span className={styles.value}>{template.benchmarks.timeReduction}</span>
                                <span className={styles.label}>Time saved</span>
                            </div>
                            <div className={styles.benchmark}>
                                <span className={styles.value}>{template.benchmarks.typicalPayback}</span>
                                <span className={styles.label}>Payback</span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>

            <p className={styles.footnote}>
                Benchmarks based on industry research. Adjust values to match your scenario.
            </p>
        </div>
    );
}

// Export templates for use elsewhere if needed
export { TEMPLATES };
