import { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useProjects } from '../hooks/useProjects';
import Button from '../components/ui/Button';
import { ArrowRightIcon, TrendingUpIcon, ClockIcon, FolderIcon, DollarIcon } from '../components/ui/Icons';
import styles from './Portfolio.module.css';

// Register Chart.js components
ChartJS.register(ArcElement, Tooltip, Legend);

// Format currency
function formatCurrency(value) {
    if (value === undefined || value === null || isNaN(value)) return '$0';
    if (value >= 1000000) {
        return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (value >= 1000) {
        return `$${(value / 1000).toFixed(0)}K`;
    }
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(value);
}

// Chart colors (professional palette)
const CHART_COLORS = [
    '#3b82f6', // Blue
    '#10b981', // Green
    '#f59e0b', // Amber
    '#8b5cf6', // Purple
    '#ec4899', // Pink
    '#06b6d4', // Cyan
    '#f97316', // Orange
    '#6366f1', // Indigo
];

export default function Portfolio() {
    const { projects, isLoading } = useProjects();
    const navigate = useNavigate();
    const [sortBy, setSortBy] = useState('savings');
    const [sortOrder, setSortOrder] = useState('desc');

    // Calculate aggregate metrics
    const metrics = useMemo(() => {
        if (!projects.length) {
            return {
                totalSavings: 0,
                avgRoi: 0,
                avgPayback: 0,
                projectCount: 0,
                totalImplementationCost: 0,
            };
        }

        const validProjects = projects.filter(p => p.results);

        const totalSavings = validProjects.reduce((sum, p) => {
            const savings = p.results?.net_annual_savings ?? p.results?.annual_savings ?? 0;
            return sum + savings;
        }, 0);

        const avgRoi = validProjects.length > 0
            ? validProjects.reduce((sum, p) => sum + (p.results?.roi_percentage ?? 0), 0) / validProjects.length
            : 0;

        const avgPayback = validProjects.length > 0
            ? validProjects.reduce((sum, p) => sum + (p.results?.payback_months ?? 0), 0) / validProjects.length
            : 0;

        const totalImplementationCost = validProjects.reduce((sum, p) => {
            return sum + (p.results?.implementation_cost ?? 0);
        }, 0);

        return {
            totalSavings,
            avgRoi: Math.round(avgRoi),
            avgPayback: Math.round(avgPayback * 10) / 10,
            projectCount: projects.length,
            totalImplementationCost,
        };
    }, [projects]);

    // Prepare chart data
    const chartData = useMemo(() => {
        const validProjects = projects.filter(p => p.results);

        return {
            labels: validProjects.map(p => p.name || 'Unnamed'),
            datasets: [{
                data: validProjects.map(p => p.results?.net_annual_savings ?? p.results?.annual_savings ?? 0),
                backgroundColor: CHART_COLORS.slice(0, validProjects.length),
                borderWidth: 0,
                hoverOffset: 4,
            }],
        };
    }, [projects]);

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    boxWidth: 12,
                    padding: 16,
                    font: {
                        family: "'Inter', sans-serif",
                        size: 12,
                    },
                    color: 'var(--text-secondary)',
                },
            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const value = context.raw;
                        return ` ${formatCurrency(value)} /year`;
                    },
                },
            },
        },
    };

    // Sort projects
    const sortedProjects = useMemo(() => {
        const sorted = [...projects].sort((a, b) => {
            let aVal, bVal;

            switch (sortBy) {
                case 'name':
                    aVal = a.name?.toLowerCase() || '';
                    bVal = b.name?.toLowerCase() || '';
                    break;
                case 'roi':
                    aVal = a.results?.roi_percentage ?? 0;
                    bVal = b.results?.roi_percentage ?? 0;
                    break;
                case 'savings':
                    aVal = a.results?.net_annual_savings ?? a.results?.annual_savings ?? 0;
                    bVal = b.results?.net_annual_savings ?? b.results?.annual_savings ?? 0;
                    break;
                case 'payback':
                    aVal = a.results?.payback_months ?? 999;
                    bVal = b.results?.payback_months ?? 999;
                    break;
                case 'priority':
                    const priorityOrder = { 'High': 3, 'Medium': 2, 'Low': 1 };
                    aVal = priorityOrder[a.results?.priority_score] ?? 0;
                    bVal = priorityOrder[b.results?.priority_score] ?? 0;
                    break;
                default:
                    aVal = 0;
                    bVal = 0;
            }

            if (typeof aVal === 'string') {
                return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
            }
            return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
        });

        return sorted;
    }, [projects, sortBy, sortOrder]);

    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const handleRowClick = (project) => {
        // Navigate to calculator with project data
        navigate('/calculator', { state: { loadProject: project } });
    };

    const getPriorityClass = (priority) => {
        switch (priority) {
            case 'High': return styles.priorityHigh;
            case 'Medium': return styles.priorityMedium;
            case 'Low': return styles.priorityLow;
            default: return '';
        }
    };

    if (isLoading) {
        return (
            <div className={styles.page}>
                <div className={styles.container}>
                    <div className={styles.loading}>Loading portfolio...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.page}>
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.header}>
                    <div>
                        <h1>Portfolio Dashboard</h1>
                        <p className={styles.subtitle}>
                            Aggregate view of all your automation ROI projects
                        </p>
                    </div>
                </div>

                {projects.length === 0 ? (
                    /* Empty State */
                    <div className={styles.emptyState}>
                        <FolderIcon size={48} className={styles.emptyIcon} />
                        <h3>No Projects Yet</h3>
                        <p>Create and save ROI calculations to build your portfolio.</p>
                        <Link to="/calculator">
                            <Button variant="primary" icon={<ArrowRightIcon size={16} />}>
                                Start Calculating
                            </Button>
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* KPI Cards */}
                        <div className={styles.kpiGrid}>
                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <DollarIcon size={20} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <span className={styles.kpiLabel}>Total Annual Savings</span>
                                    <span className={`${styles.kpiValue} ${styles.valueSuccess}`}>
                                        {formatCurrency(metrics.totalSavings)}
                                    </span>
                                    <span className={styles.kpiHelper}>Potential savings across all projects</span>
                                </div>
                            </div>

                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <TrendingUpIcon size={20} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <span className={styles.kpiLabel}>Average ROI</span>
                                    <span className={`${styles.kpiValue} ${styles.valueAccent}`}>
                                        {metrics.avgRoi}%
                                    </span>
                                    <span className={styles.kpiHelper}>Mean return on investment</span>
                                </div>
                            </div>

                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <ClockIcon size={20} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <span className={styles.kpiLabel}>Avg Payback Period</span>
                                    <span className={styles.kpiValue}>
                                        {metrics.avgPayback} mo
                                    </span>
                                    <span className={styles.kpiHelper}>Average time to break even</span>
                                </div>
                            </div>

                            <div className={styles.kpiCard}>
                                <div className={styles.kpiIcon}>
                                    <FolderIcon size={20} />
                                </div>
                                <div className={styles.kpiContent}>
                                    <span className={styles.kpiLabel}>Total Projects</span>
                                    <span className={styles.kpiValue}>
                                        {metrics.projectCount}
                                    </span>
                                    <span className={styles.kpiHelper}>Automation opportunities analyzed</span>
                                </div>
                            </div>
                        </div>

                        {/* Chart & Table Section */}
                        <div className={styles.mainGrid}>
                            {/* Savings Distribution Chart */}
                            <div className={styles.chartSection}>
                                <h3>Savings Distribution</h3>
                                <div className={styles.chartContainer}>
                                    {projects.filter(p => p.results).length > 0 ? (
                                        <Doughnut data={chartData} options={chartOptions} />
                                    ) : (
                                        <p className={styles.noData}>No results data available</p>
                                    )}
                                </div>
                            </div>

                            {/* Projects Table */}
                            <div className={styles.tableSection}>
                                <h3>All Projects</h3>
                                <div className={styles.tableWrapper}>
                                    <table className={styles.table}>
                                        <thead>
                                            <tr>
                                                <th
                                                    onClick={() => handleSort('name')}
                                                    className={styles.sortable}
                                                >
                                                    Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('priority')}
                                                    className={styles.sortable}
                                                >
                                                    Priority {sortBy === 'priority' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('roi')}
                                                    className={styles.sortable}
                                                >
                                                    ROI {sortBy === 'roi' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('savings')}
                                                    className={styles.sortable}
                                                >
                                                    Annual Savings {sortBy === 'savings' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </th>
                                                <th
                                                    onClick={() => handleSort('payback')}
                                                    className={styles.sortable}
                                                >
                                                    Payback {sortBy === 'payback' && (sortOrder === 'asc' ? '↑' : '↓')}
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {sortedProjects.map(project => (
                                                <tr
                                                    key={project.id}
                                                    onClick={() => handleRowClick(project)}
                                                    className={styles.clickableRow}
                                                >
                                                    <td className={styles.projectName}>{project.name}</td>
                                                    <td>
                                                        <span className={`${styles.priority} ${getPriorityClass(project.results?.priority_score)}`}>
                                                            {project.results?.priority_score || '—'}
                                                        </span>
                                                    </td>
                                                    <td className={styles.valueCell}>
                                                        {project.results?.roi_percentage
                                                            ? `${project.results.roi_percentage}%`
                                                            : '—'}
                                                    </td>
                                                    <td className={`${styles.valueCell} ${styles.savingsCell}`}>
                                                        {formatCurrency(project.results?.net_annual_savings ?? project.results?.annual_savings)}
                                                    </td>
                                                    <td className={styles.valueCell}>
                                                        {project.results?.payback_months
                                                            ? `${project.results.payback_months} mo`
                                                            : '—'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className={styles.actions}>
                            <Link to="/calculator">
                                <Button variant="primary" icon={<ArrowRightIcon size={16} />}>
                                    Add New Project
                                </Button>
                            </Link>
                            <Link to="/compare">
                                <Button variant="secondary">
                                    Compare Projects
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
