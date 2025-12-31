import styles from './Business.module.css';

export default function Business() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>For Business</h1>
                <p className={styles.subtitle}>
                    Need custom automation solutions? Let us help you build it.
                </p>

                <div className={styles.placeholder}>
                    <p>Contact form coming soon...</p>
                </div>
            </div>
        </div>
    );
}
