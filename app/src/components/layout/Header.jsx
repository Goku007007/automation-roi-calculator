import { useState, useEffect } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import ThemeToggle from '../ui/ThemeToggle';
import styles from './Header.module.css';

export default function Header() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const location = useLocation();

    // Close mobile menu when route changes
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Prevent body scroll when menu is open
    useEffect(() => {
        if (isMobileMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMobileMenuOpen]);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    return (
        <header className={styles.header}>
            <div className={styles.container}>
                {/* Logo */}
                <NavLink to="/" className={styles.logo}>
                    <img src="/logo.svg" alt="AutomateROI" className={styles.logoImg} />
                </NavLink>

                {/* Desktop Navigation */}
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
                        to="/compare"
                        className={({ isActive }) => isActive ? `${styles.navLink} ${styles.active}` : styles.navLink}
                    >
                        Compare
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

                    {/* Mobile Menu Button */}
                    <button
                        className={`${styles.mobileMenuBtn} ${isMobileMenuOpen ? styles.mobileMenuBtnOpen : ''}`}
                        onClick={toggleMobileMenu}
                        aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMobileMenuOpen}
                    >
                        <span className={styles.hamburgerLine}></span>
                        <span className={styles.hamburgerLine}></span>
                        <span className={styles.hamburgerLine}></span>
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Overlay */}
            <div
                className={`${styles.mobileOverlay} ${isMobileMenuOpen ? styles.mobileOverlayOpen : ''}`}
                onClick={closeMobileMenu}
            />

            {/* Mobile Navigation Menu */}
            <nav className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.mobileNavOpen : ''}`}>
                <NavLink
                    to="/"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                    end
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
                        <polyline points="9 22 9 12 15 12 15 22"></polyline>
                    </svg>
                    Home
                </NavLink>
                <NavLink
                    to="/calculator"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                        <line x1="8" y1="6" x2="16" y2="6"></line>
                        <line x1="8" y1="10" x2="10" y2="10"></line>
                        <line x1="14" y1="10" x2="16" y2="10"></line>
                        <line x1="8" y1="14" x2="10" y2="14"></line>
                        <line x1="14" y1="14" x2="16" y2="14"></line>
                        <line x1="8" y1="18" x2="10" y2="18"></line>
                        <line x1="14" y1="18" x2="16" y2="18"></line>
                    </svg>
                    Calculator
                </NavLink>
                <NavLink
                    to="/playground"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polygon points="12 2 2 7 12 12 22 7 12 2"></polygon>
                        <polyline points="2 17 12 22 22 17"></polyline>
                        <polyline points="2 12 12 17 22 12"></polyline>
                    </svg>
                    Playground
                </NavLink>
                <NavLink
                    to="/marketplace"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="9" cy="21" r="1"></circle>
                        <circle cx="20" cy="21" r="1"></circle>
                        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
                    </svg>
                    Marketplace
                </NavLink>
                <NavLink
                    to="/compare"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="20" x2="18" y2="10"></line>
                        <line x1="12" y1="20" x2="12" y2="4"></line>
                        <line x1="6" y1="20" x2="6" y2="14"></line>
                    </svg>
                    Compare
                </NavLink>
                <NavLink
                    to="/docs"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                    </svg>
                    Docs
                </NavLink>
                <NavLink
                    to="/business"
                    className={({ isActive }) => isActive ? `${styles.mobileNavLink} ${styles.active}` : styles.mobileNavLink}
                >
                    <svg className={styles.mobileNavIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
                        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
                    </svg>
                    For Business
                </NavLink>
            </nav>
        </header>
    );
}
