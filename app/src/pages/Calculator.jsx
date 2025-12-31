import styles from './Calculator.module.css';

export default function Calculator() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <h1>ROI Calculator</h1>
                <p className={styles.subtitle}>
                    Calculate the return on investment for your automation projects.
                </p>

                {/* Calculator form will be added here */}
                <div className={styles.placeholder}>
                    <p>Calculator component coming soon...</p>
                </div>
            </div>
        </div>
    );
}
