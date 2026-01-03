import { useState } from 'react';
import CalculatorForm from '../components/calculator/CalculatorForm';
import ProcessTemplates from '../components/calculator/ProcessTemplates';
import Results from '../components/calculator/Results';
import ProjectList from '../components/calculator/ProjectList';
import ScenarioTabs from '../components/calculator/ScenarioTabs';
import ScenarioCompare from '../components/calculator/ScenarioCompare';
import { ResultsSkeleton } from '../components/ui/Skeleton';
import Button from '../components/ui/Button';
import { XIcon, FolderIcon } from '../components/ui/Icons';
import { useProjects } from '../hooks/useProjects';
import { calculateROI, generatePDF } from '../utils/api';
import styles from './Calculator.module.css';

export default function Calculator() {
    const [results, setResults] = useState(null);
    const [formData, setFormData] = useState(null);
    const [formKey, setFormKey] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [isDownloading, setIsDownloading] = useState(false);
    const [error, setError] = useState(null);
    const [showProjects, setShowProjects] = useState(false);
    const [loadedInputs, setLoadedInputs] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);

    // Scenario management
    const [activeScenario, setActiveScenario] = useState('base');
    const [scenarios, setScenarios] = useState({
        base: null,
        best: null,
        worst: null,
    });

    const { projects, saveProject, deleteProject, duplicateProject } = useProjects();

    // Handle template selection
    const handleSelectTemplate = (template) => {
        setSelectedTemplate(template.id);
        setLoadedInputs(template.defaults);
        setFormKey(prev => prev + 1);
        setResults(null); // Clear previous results
    };

    const handleSubmit = async (data) => {
        setIsLoading(true);
        setError(null);
        setFormData(data);

        try {
            const result = await calculateROI(data);
            setResults(result);

            // Save to current scenario
            setScenarios(prev => ({
                ...prev,
                [activeScenario]: { inputs: data, results: result },
            }));
        } catch (err) {
            setError(err.message || 'Failed to calculate ROI');
            setResults(null);
        } finally {
            setIsLoading(false);
        }
    };

    const handleScenarioChange = (scenarioId) => {
        setActiveScenario(scenarioId);

        // If scenario has data, load it
        const scenario = scenarios[scenarioId];
        if (scenario) {
            setLoadedInputs(scenario.inputs);
            setResults(scenario.results);
            setFormData(scenario.inputs);
            setFormKey(prev => prev + 1);
        }
    };

    const handleSaveProject = () => {
        if (!formData || !results) return;
        saveProject({
            inputs: formData,
            results,
            scenarios: Object.fromEntries(
                Object.entries(scenarios).filter(([_, v]) => v !== null)
            ),
        });
        setShowProjects(true);
    };

    const handleLoadProject = (project) => {
        setLoadedInputs(project.inputs);
        setResults(project.results);
        setFormData(project.inputs);
        setFormKey(prev => prev + 1);
        setShowProjects(false);

        // Load scenarios if available
        if (project.scenarios) {
            setScenarios({
                base: project.scenarios.base || null,
                best: project.scenarios.best || null,
                worst: project.scenarios.worst || null,
            });
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

    const handleClearScenarios = () => {
        setScenarios({ base: null, best: null, worst: null });
        setResults(null);
        setFormData(null);
        setLoadedInputs(null);
        setFormKey(prev => prev + 1);
        setActiveScenario('base');
    };

    return (
        <div className={styles.page}>
            <div className={styles.layout}>
                {/* Sidebar - Saved Projects */}
                <aside className={`${styles.sidebar} ${showProjects ? styles.sidebarOpen : ''}`}>
                    <div className={styles.sidebarHeader}>
                        <h3>Saved Projects</h3>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setShowProjects(false)}
                            aria-label="Close sidebar"
                        >
                            <XIcon size={18} />
                        </Button>
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
                                    Calculate and compare scenarios for your automation projects.
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                size="sm"
                                onClick={() => setShowProjects(!showProjects)}
                                icon={<FolderIcon size={16} />}
                            >
                                Projects ({projects.length})
                            </Button>
                        </div>

                        {/* Scenario Tabs */}
                        <ScenarioTabs
                            activeScenario={activeScenario}
                            scenarios={scenarios}
                            onScenarioChange={handleScenarioChange}
                        />

                        {/* Process Templates - Quick Start */}
                        <ProcessTemplates
                            onSelectTemplate={handleSelectTemplate}
                            selectedId={selectedTemplate}
                        />

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

                        {/* Loading Skeleton */}
                        {isLoading && <ResultsSkeleton />}

                        {/* Results */}
                        {!isLoading && results && (
                            <>
                                <Results
                                    data={results}
                                    onDownloadPDF={handleDownloadPDF}
                                    isDownloading={isDownloading}
                                />

                                {/* Save Actions */}
                                <div className={styles.saveActions}>
                                    <Button
                                        variant="secondary"
                                        onClick={handleSaveProject}
                                    >
                                        Save Project
                                    </Button>
                                    {Object.values(scenarios).some(s => s !== null) && (
                                        <Button
                                            variant="ghost"
                                            onClick={handleClearScenarios}
                                        >
                                            Clear All
                                        </Button>
                                    )}
                                </div>
                            </>
                        )}

                        {/* Scenario Comparison Table */}
                        <ScenarioCompare scenarios={scenarios} />
                    </div>
                </main>
            </div>
        </div>
    );
}
