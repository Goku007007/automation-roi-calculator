import styles from './EmptyState.module.css';

export default function EmptyState({
    icon,
    title,
    description,
    action,
    size = 'md',
    className = ''
}) {
    return (
        <div className={`${styles.emptyState} ${styles[size]} ${className}`}>
            {icon && <div className={styles.icon}>{icon}</div>}
            {title && <h4 className={styles.title}>{title}</h4>}
            {description && <p className={styles.description}>{description}</p>}
            {action && <div className={styles.action}>{action}</div>}
        </div>
    );
}
