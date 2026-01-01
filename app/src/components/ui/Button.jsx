import styles from './Button.module.css';
import Spinner from './Spinner';

export default function Button({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    type = 'button',
    fullWidth = false,
    icon,
    className = '',
    ...props
}) {
    const classNames = [
        styles.button,
        styles[variant],
        styles[size],
        fullWidth ? styles.fullWidth : '',
        loading ? styles.loading : '',
        className,
    ].filter(Boolean).join(' ');

    return (
        <button
            type={type}
            className={classNames}
            disabled={disabled || loading}
            {...props}
        >
            {loading && <Spinner size="sm" light={variant === 'primary' || variant === 'destructive'} />}
            {!loading && icon && <span className={styles.icon}>{icon}</span>}
            {!loading && children}
        </button>
    );
}
