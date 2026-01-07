import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/ui/Button';
import { DownloadIcon, ArrowRightIcon } from '../components/ui/Icons';
import styles from './Compare.module.css';

// Format currency
function formatCurrency(value) {
    if (value === undefined || value === null) return '—';
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// Metrics to compare
const METRICS = [
    { key: 'process_name', label: 'Process Name', format: 'text', source: 'inputs' },
    { key: 'priority_score', label: 'Priority', format: 'text', source: 'results' },
    { key: 'roi_percentage', label: 'ROI', format: 'percent', source: 'results', higherBetter: true },
    { key: 'payback_months', label: 'Payback Period', format: 'months', source: 'results', higherBetter: false },
    { key: 'net_annual_savings', label: 'Annual Savings', format: 'currency', source: 'results', higherBetter: true, fallback: 'annual_savings' },
    { key: 'five_year_savings', label: '5-Year Savings', format: 'currency', source: 'results', higherBetter: true },
    { key: 'implementation_cost', label: 'Implementation Cost', format: 'currency', source: 'results', higherBetter: false },
    { key: 'annual_labor_cost', label: 'Current Labor Cost', format: 'currency', source: 'results', higherBetter: false },
];

export default function Compare() {
    const { projects, isLoading } = useProjects();
    const [selectedIds, setSelectedIds] = useState(new Set());

    const toggleProject = (id) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });
    };

    const selectedProjects = projects.filter(p => selectedIds.has(p.id));

    const formatValue = (value, format) => {
        if (value === undefined || value === null) return '—';
        switch (format) {
            case 'currency':
                return formatCurrency(value);
            case 'months':
                return `${value} mo`;
            case 'percent':
                return `${value}%`;
            default:
                return value;
        }
    };

    const getBestProjectId = (metric) => {
        if (!metric.higherBetter === undefined || selectedProjects.length < 2) return null;

        const values = selectedProjects.map(p => {
            const data = metric.source === 'inputs' ? p.inputs : p.results;
            return { id: p.id, value: data?.[metric.key] ?? data?.[metric.fallback] };
        }).filter(v => v.value !== undefined && v.value !== null);

        if (values.length === 0) return null;

        return values.reduce((best, curr) => {
            if (metric.higherBetter) {
                return curr.value > best.value ? curr : best;
            }
            return curr.value < best.value ? curr : best;
        }, values[0]).id;
    };

    const exportCSV = () => {
        const headers = ['Metric', ...selectedProjects.map(p => p.name)];
        const rows = METRICS.map(metric => {
            const row = [metric.label];
            selectedProjects.forEach(p => {
                const data = metric.source === 'inputs' ? p.inputs : p.results;
                const value = data?.[metric.key] ?? data?.[metric.fallback];
                row.push(formatValue(value, metric.format));
            });
            return row;
        });

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'project_comparison.csv';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading projects...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div>
                        <h1>Compare Projects</h1>
                        <p className={styles.subtitle}>
                            Select projects to compare side-by-side
                        </p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    <div className={styles.emptyState}>
                        <h3>No Saved Projects</h3>
                        <p>Calculate and save projects first to compare them here.</p>
                        <Link to="/calculator">
                            <Button variant="primary" icon={<ArrowRightIcon size={16} />}>
                                Go to Calculator
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Project Selection */}
                        <div className={styles.selection}>
                            <h3>Select Projects ({selectedIds.size} selected)</h3>
                            <div className={styles.projectGrid}>
                                {projects.map(project => (
                                    <label
                                        key={project.id}
                                        className={`${styles.projectCard} ${selectedIds.has(project.id) ? styles.selected : ''}`}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedIds.has(project.id)}
                                            onChange={() => toggleProject(project.id)}
                                        />
                                        <div className={styles.projectInfo}>
                                            <span className={styles.projectName}>{project.name}</span>
                                            <span className={styles.projectMeta}>
                                                ROI: {project.results?.roi_percentage || '—'}%
                                            </span>
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Comparison Table */}
                        {selectedProjects.length >= 2 && (
                            <div className={styles.comparison}>
                                <div className={styles.comparisonHeader}>
                                    <h3>Comparison</h3>
                                    <Button
                                        variant="secondary"
                                        size="sm"
                                        onClick={exportCSV}
                                        icon={<DownloadIcon size={14} />}
                                    >
                                        Export CSV
                                    </Button>
                                </div>

                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th>Metric</th>
                                                {selectedProjects.map(p => (
                                                    <th key={p.id}>{p.name}</th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {METRICS.map(metric => {
                                                const bestId = getBestProjectId(metric);
                                                return (
                                                    <tr key={metric.key}>
                                                        <td className={styles.metricLabel}>{metric.label}</td>
                                                        {selectedProjects.map(p => {
                                                            const data = metric.source === 'inputs' ? p.inputs : p.results;
                                                            const value = data?.[metric.key] ?? data?.[metric.fallback];
                                                            const isBest = bestId === p.id;
                                                            return (
                                                                <td
                                                                    key={p.id}
                                                                    className={`${styles.value} ${isBest ? styles.best : ''}`}
                                                                >
                                                                    {formatValue(value, metric.format)}
                                                                    {isBest && <span className={styles.star}>★</span>}
                                                                </td>
                                                            );
                                                        })}
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}

                        {selectedProjects.length === 1 && (
                            <div className={styles.hint}>
                                Select at least one more project to compare.
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
