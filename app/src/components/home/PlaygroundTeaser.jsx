import { Link } from 'react-router-dom';
import { WrenchIcon, ArrowRightIcon } from '../ui/Icons';
import Button from '../ui/Button';
import styles from './PlaygroundTeaser.module.css';

export default function PlaygroundTeaser() {
    return (
        <section className={styles.section}>
            <div className={styles.content}>
                <div className={styles.badge}>
                    <span>Coming Soon</span>
                </div>
                <h2 className={styles.title}>Workflow Cost Playground</h2>
                <p className={styles.description}>
                    Drag and drop automation steps to build workflows visually.
                    Estimate API calls, execution costs, and tool spend before you build.
                </p>
                <div className={styles.cta}>
                    <Link to="/playground">
                        <Button variant="secondary">
                            <WrenchIcon size={16} />
                            Explore Preview
                        </Button>
                    </Link>
                </div>
            </div>
        </section>
    );
}
