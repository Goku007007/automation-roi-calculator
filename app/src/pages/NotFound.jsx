import { Link } from 'react-router-dom';
import styles from './NotFound.module.css';

export default function NotFound() {
    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <span className={styles.code}>404</span>
                <h1>Page not found</h1>
                <p>The page you're looking for doesn't exist or has been moved.</p>
                <div className={styles.actions}>
                    <Link to="/" className={styles.primaryBtn}>
                        Go Home
                    </Link>
                    <Link to="/calculator" className={styles.secondaryBtn}>
                        Try Calculator
                    </Link>
                </div>
            </div>
        </div>
    );
}
