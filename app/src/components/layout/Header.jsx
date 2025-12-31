import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <NavLink to="/" className={styles.logo}>
                    <span className={styles.logoText}>AutomateROI</span>
                </NavLink>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <NavLink
                        to="/calculator"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        Calculator
                    </NavLink>
                    <NavLink
                        to="/playground"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        Playground
                    </NavLink>
                    <NavLink
                        to="/docs"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        Docs
                    </NavLink>
                    <NavLink
                        to="/business"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        For Business
                    </NavLink>
                </nav>

                {/* Right Side */}
                <div className={styles.actions}>
                    <ThemeToggle />
                </div>
            </div>
        </header>
    );
}
