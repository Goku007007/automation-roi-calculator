import styles from './Playground.module.css';

export default function Playground() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>Playground</h1>
                <p className={styles.subtitle}>
                    Simulate automation scenarios and estimate costs with common tools.
                </p>

                <div className={styles.placeholder}>
                    <p>Tool simulator coming soon...</p>
                </div>
            </div>
        </div>
    );
}
