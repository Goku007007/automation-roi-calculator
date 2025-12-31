import { useState } from 'react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import Results from '../components/calculator/Results';
import { calculateROI, generatePDF } from '../utils/api';
import styles from './Calculator.module.css';

export default function Calculator() {
    const [results, setResults] = useState(null);
    const [formData, setFormData] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        setFormData(data);

        try {
            const result = await calculateROI(data);
            setResults(result);
        } catch (err) {
            setError(err.message || 'Failed to calculate ROI');
            setResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        if (!formData) return;

        setIsDownloading(true);
        try {
            const blob = await generatePDF(formData);
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `ROI_Report_${formData.process_name.replace(/\s+/g, '_')}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (err) {
            setError('Failed to generate PDF');
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1>ROI Calculator</h1>
                    <p className={styles.subtitle}>
                        Calculate the return on investment for your automation projects.
                    </p>
                </div>

                {error && (
                    <div className={styles.error}>
                        {error}
                    </div>
                )}

                <CalculatorForm
                    onSubmit={handleSubmit}
                    isLoading={isLoading}
                />

                <Results
                    data={results}
                    onDownloadPDF={handleDownloadPDF}
                    isDownloading={isDownloading}
                />
            </div>
        </div>
    );
}
