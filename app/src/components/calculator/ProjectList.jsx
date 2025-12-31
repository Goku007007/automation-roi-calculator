import { Link } from 'react-router-dom';
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
            <div className={styles.empty}>
                <p>No saved projects yet</p>
                <p className={styles.hint}>Calculate ROI and save to build your library</p>
            </div>
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
                        <button
                            className={styles.loadBtn}
                            onClick={() => onLoad(project)}
                        >
                            Load
                        </button>
                        <button
                            className={styles.actionBtn}
                            onClick={() => onDuplicate(project.id)}
                            title="Duplicate"
                        >
                            ⧉
                        </button>
                        <button
                            className={`${styles.actionBtn} ${styles.deleteBtn}`}
                            onClick={() => onDelete(project.id)}
                            title="Delete"
                        >
                            ×
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
}
