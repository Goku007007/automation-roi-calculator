import { NavLink } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <NavLink to="/" className={styles.logo}>
                    <img src="/logo.svg" alt="AutomateROI" className={styles.logoImg} />
                </NavLink>

                {/* Navigation */}
                <nav className={styles.nav}>
                    <NavLink
                        to="/"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                        end
                    >
                        Home
                    </NavLink>
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
                        to="/marketplace"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        Marketplace
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
