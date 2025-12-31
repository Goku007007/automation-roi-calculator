import { ChartBarIcon, CopyIcon, TrashIcon } from '../ui/Icons';
import EmptyState from '../ui/EmptyState';
import Button from '../ui/Button';
import styles from './ProjectList.module.css';

function formatDate(dateString) {
    return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

function formatCurrency(value) {
    if (!value) return '$0';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

export default function ProjectList({ projects, onLoad, onDelete, onDuplicate }) {
    if (!projects || projects.length === 0) {
        return (
            <EmptyState
                icon={<ChartBarIcon size={32} />}
                title="No projects yet"
                description="Run your first calculation and save it to build your project library."
                size="md"
            />
        );
    }

    return (
        <div className={styles.list}>
            {projects.map(project => (
                <div key={project.id} className={styles.project}>
                    <div className={styles.info}>
                        <h4 className={styles.name}>{project.name}</h4>
                        <span className={styles.date}>{formatDate(project.updated)}</span>
                    </div>

                    {project.results && (
                        <div className={styles.preview}>
                            <span className={styles.savings}>
                                {formatCurrency(project.results.net_annual_savings || project.results.annual_savings)}
                                <small>/yr</small>
                            </span>
                            <span className={styles.roi}>
                                {project.results.roi_percentage}% ROI
                            </span>
                        </div>
                    )}

                    <div className={styles.actions}>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onLoad(project)}
                        >
                            Load
                        </Button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => onDuplicate(project.id)}
                            title="Duplicate"
                            aria-label="Duplicate project"
                        >
                            <CopyIcon size={14} />
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete(project.id)}
                            title="Delete"
                            aria-label="Delete project"
                        >
                            <TrashIcon size={14} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}

