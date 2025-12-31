import styles from './Spinner.module.css';

export default function Spinner({ size = 'md', light = false }) {
    return (
        <div className={`${styles.spinner} ${styles[size]} ${light ? styles.light : ''}`} />
    );
}
