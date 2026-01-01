import styles from './ReportPreview.module.css';
import Button from '../ui/Button';
import { ArrowRightIcon, DownloadIcon } from '../ui/Icons';
import { Link } from 'react-router-dom';

export default function ReportPreview() {
    return (
        <section className={styles.section}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <span className={styles.badge}>See It In Action</span>
                    <h2 className={styles.title}>Professional Reports, Instantly</h2>
                    <p className={styles.subtitle}>
                        Generate executive-ready PDF reports with your calculations.
                        Perfect for stakeholder presentations and budget approvals.
                    </p>
                </div>

                <div className={styles.showcase}>
                    {/* Left: Calculator Screenshots */}
                    <div className={styles.screenshotsColumn}>
                        <div className={styles.screenshotCard}>
                            <div className={styles.stepBadge}>1</div>
                            <img
                                src="/screenshots/calculator-form.png"
                                alt="ROI Calculator Form"
                                className={styles.screenshot}
                            />
                            <p className={styles.caption}>Enter your process details</p>
                        </div>
                        <div className={styles.screenshotCard}>
                            <div className={styles.stepBadge}>2</div>
                            <img
                                src="/screenshots/calculator-results.png"
                                alt="ROI Calculation Results"
                                className={styles.screenshot}
                            />
                            <p className={styles.caption}>Get instant savings analysis</p>
                        </div>
                    </div>

                    {/* Right: PDF Preview */}
                    <div className={styles.pdfColumn}>
                        <div className={styles.pdfCard}>
                            <div className={styles.stepBadge}>3</div>
                            <div className={styles.pdfPreview}>
                                <div className={styles.pdfHeader}>
                                    <span className={styles.pdfIcon}>📄</span>
                                    <span className={styles.pdfTitle}>ROI Report</span>
                                </div>
                                <iframe
                                    src="/screenshots/sample-report.pdf#toolbar=0&navpanes=0"
                                    className={styles.pdfFrame}
                                    title="Sample ROI Report"
                                />
                            </div>
                            <p className={styles.caption}>Download your professional PDF report</p>
                        </div>
                    </div>
                </div>

                <div className={styles.features}>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        <span>Executive-ready format</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        <span>Shareable with stakeholders</span>
                    </div>
                    <div className={styles.feature}>
                        <span className={styles.featureIcon}>✓</span>
                        <span>Perfect for budget proposals</span>
                    </div>
                </div>

                <div className={styles.cta}>
                    <Link to="/calculator">
                        <Button variant="primary" size="lg">
                            <span>Try the Calculator</span>
                            <ArrowRightIcon size={18} />
                        </Button>
                    </Link>
                    <a
                        href="/screenshots/sample-report.pdf"
                        download="AutomateROI_Sample_Report.pdf"
                    >
                        <Button variant="secondary" size="lg">
                            <DownloadIcon size={18} />
                            <span>Download Sample PDF</span>
                        </Button>
                    </a>
                </div>
            </div>
        </section>
    );
}
