import { useState, useEffect } from 'react';
import { CheckCircleIcon, XCircleIcon, AlertTriangleIcon, InfoIcon, XIcon } from './Icons';
import styles from './Toast.module.css';

export default function Toast({ message, type = 'success', duration = 3000, onClose }) {
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            setTimeout(onClose, 300); // Wait for fade animation
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    const IconComponent = {
        success: CheckCircleIcon,
        error: XCircleIcon,
        warning: AlertTriangleIcon,
        info: InfoIcon,
    }[type] || InfoIcon;

    return (
        <div className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : styles.hidden}`}>
            <span className={styles.icon}>
                <IconComponent size={16} />
            </span>
            <span className={styles.message}>{message}</span>
            <button
                className={styles.close}
                onClick={() => { setVisible(false); onClose(); }}
                aria-label="Dismiss notification"
            >
                <XIcon size={16} />
            </button>
        </div>
    );
}

// Toast container for multiple toasts
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className={styles.container} role="status" aria-live="polite">
            {toasts.map(toast => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    duration={toast.duration}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
}
