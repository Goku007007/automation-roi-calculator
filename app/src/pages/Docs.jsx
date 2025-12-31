import styles from './Docs.module.css';

export default function Docs() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Documentation</h1>
                <p className={styles.subtitle}>
                    Reference for tool costs, AI models, and pricing structures.
                </p>

                <div className={styles.placeholder}>
                    <p>Documentation hub coming soon...</p>
                </div>
            </div>
        </div>
    );
}
