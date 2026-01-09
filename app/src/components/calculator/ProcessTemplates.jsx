import * as Icons from '../ui/Icons';
import { TEMPLATES } from '../../data/templates';
import styles from './ProcessTemplates.module.css';

export default function ProcessTemplates({ onSelectTemplate, selectedId }) {
    // Only show the original 3 for Quick Start to keep it compact, or show all? 
    // Let's show all 5, it's better for discovery.
    const displayTemplates = TEMPLATES;

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h3>Quick Start Templates</h3>
                <p>Select a common process to pre-fill with industry benchmarks</p>
            </div>

            <div className={styles.grid}>
                {displayTemplates.map(template => {
                    const IconComponent = Icons[template.icon] || Icons.FolderIcon;

                    return (
                        <button
                            key={template.id}
                            className={`${styles.card} ${selectedId === template.id ? styles.selected : ''}`}
                            onClick={() => onSelectTemplate(template)}
                            type="button"
                        >
                            <div className={styles.cardHeader}>
                                <span className={styles.icon}>
                                    <IconComponent size={24} />
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
                    );
                })}
            </div>

            <p className={styles.footnote}>
                Benchmarks based on industry research. Adjust values to match your scenario.
            </p>
        </div>
    );
}

