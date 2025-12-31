import { useState, useEffect } from 'react';
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

    const icons = {
        success: '✓',
        error: '✕',
        warning: '⚠',
        info: 'ℹ',
    };

    return (
        <div className={`${styles.toast} ${styles[type]} ${visible ? styles.visible : styles.hidden}`}>
            <span className={styles.icon}>{icons[type]}</span>
            <span className={styles.message}>{message}</span>
            <button className={styles.close} onClick={() => { setVisible(false); onClose(); }}>×</button>
        </div>
    );
}

// Toast container for multiple toasts
export function ToastContainer({ toasts, removeToast }) {
    return (
        <div className={styles.container}>
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
