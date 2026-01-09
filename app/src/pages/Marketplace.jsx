import { useNavigate } from 'react-router-dom';
import * as Icons from '../components/ui/Icons';
import Button from '../components/ui/Button';
import { TEMPLATES } from '../data/templates';
import styles from './Marketplace.module.css';

export default function Marketplace() {
    const navigate = useNavigate();

    const handleUseTemplate = (template) => {
        // Navigate to calculator and pre-fill data via location state
        navigate('/calculator', {
            state: {
                loadProject: {
                    id: template.id,
                    defaults: template.defaults,
                    // Flag to tell Calculator this is a template, not a saved project
                    isTemplate: true
                }
            }
        });
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <span className={styles.badge}>Template Library</span>
                    <h1 className={styles.title}>Automation Marketplace</h1>
                    <p className={styles.subtitle}>
                        Browse verified automation workflows, pre-configured with industry benchmarks.
                        Select a template to instantly start your ROI calculation.
                    </p>
                </div>

                {/* Grid */}
                <div className={styles.grid}>
                    {TEMPLATES.map(template => {
                        // Dynamically resolve icon, fallback to FolderIcon
                        const IconComponent = Icons[template.icon] || Icons.FolderIcon;

                        return (
                            <div key={template.id} className={styles.card}>
                                <div className={styles.cardHeader}>
                                    <div className={styles.iconWrapper}>
                                        <IconComponent size={24} />
                                    </div>
                                    <span className={styles.category}>{template.category}</span>
                                </div>

                                <h3 className={styles.cardTitle}>{template.name}</h3>
                                <p className={styles.description}>{template.description}</p>

                                <div className={styles.metrics}>
                                    <div className={styles.metric}>
                                        <span className={styles.metricValue}>{template.benchmarks.timeReduction}</span>
                                        <span className={styles.metricLabel}>Time Savings</span>
                                    </div>
                                    <div className={styles.metric}>
                                        <span className={styles.metricValue}>{template.benchmarks.typicalPayback}</span>
                                        <span className={styles.metricLabel}>Payback</span>
                                    </div>
                                </div>

                                <div className={styles.footer}>
                                    <Button
                                        variant="primary"
                                        fullWidth
                                        onClick={() => handleUseTemplate(template)}
                                        icon={<Icons.ArrowRightIcon size={16} />}
                                    >
                                        Use Template
                                    </Button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
