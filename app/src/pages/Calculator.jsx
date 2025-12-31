import { useState } from 'react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import Results from '../components/calculator/Results';
import ProjectList from '../components/calculator/ProjectList';
import { useProjects } from '../hooks/useProjects';
import { calculateROI, generatePDF } from '../utils/api';
import styles from './Calculator.module.css';

export default function Calculator() {
    const [results, setResults] = useState(null);
    const [formData, setFormData] = useState(null);
    const [formKey, setFormKey] = useState(0); // For resetting form
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);
    const [showProjects, setShowProjects] = useState(false);
    const [loadedInputs, setLoadedInputs] = useState(null);

    const { projects, saveProject, deleteProject, duplicateProject } = useProjects();

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

    const handleSaveProject = () => {
        if (!formData || !results) return;
        saveProject({ inputs: formData, results });
        setShowProjects(true);
    };

    const handleLoadProject = (project) => {
        setLoadedInputs(project.inputs);
        setResults(project.results);
        setFormData(project.inputs);
        setFormKey(prev => prev + 1); // Force form re-render
        setShowProjects(false);
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
            <div className={styles.layout}>
                {/* Sidebar - Saved Projects */}
                <aside className={`${styles.sidebar} ${showProjects ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h3>Saved Projects</h3>
                        <button
                            className={styles.closeBtn}
                            onClick={() => setShowProjects(false)}
                        >
                            ×
                        </button>
                    </div>
                    <ProjectList
                        projects={projects}
                        onLoad={handleLoadProject}
                        onDelete={deleteProject}
                        onDuplicate={duplicateProject}
                    />
                </aside>

                {/* Main Content */}
                <main className={styles.main}>
                    <div className={styles.container}>
                        <div className={styles.header}>
                            <div>
                                <h1>ROI Calculator</h1>
                                <p className={styles.subtitle}>
                                    Calculate the return on investment for your automation projects.
                                </p>
                            </div>
                            <button
                                className={styles.projectsBtn}
                                onClick={() => setShowProjects(!showProjects)}
                            >
                                Projects ({projects.length})
                            </button>
                        </div>

                        {error && (
                            <div className={styles.error}>
                                {error}
                            </div>
                        )}

                        <CalculatorForm
                            key={formKey}
                            onSubmit={handleSubmit}
                            isLoading={isLoading}
                            initialData={loadedInputs}
                        />

                        {results && (
                            <>
                                <Results
                                    data={results}
                                    onDownloadPDF={handleDownloadPDF}
                                    isDownloading={isDownloading}
                                />

                                {/* Save Project Button */}
                                <div className={styles.saveActions}>
                                    <button
                                        className={styles.saveBtn}
                                        onClick={handleSaveProject}
                                    >
                                        Save Project
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
