import { useState, useEffect } from 'react';
import styles from './CalculatorForm.module.css';

const FREQUENCIES = [
    { value: 'every_minute', label: 'Every Minute' },
    { value: 'hourly', label: 'Hourly' },
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'biweekly', label: 'Biweekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'quarterly', label: 'Quarterly' },
];

const defaultFormData = {
    process_name: '',
    frequency: 'daily',
    runs_per_period: '',
    hours_per_run: '',
    staff_count: '',
    hourly_rate: '',
    implementation_cost: '',
    software_license_cost: '0',
    annual_maintenance_cost: '0',
    error_rate: '0',
    error_fix_cost: '0',
    expected_labor_reduction: 70,
};

export default function CalculatorForm({ onSubmit, isLoading, initialData }) {
    const [formData, setFormData] = useState(defaultFormData);
    const [showAdvanced, setShowAdvanced] = useState(false);

    // Load initial data when provided (e.g., from saved project)
    useEffect(() => {
        if (initialData) {
            setFormData({
                process_name: initialData.process_name || '',
                frequency: initialData.frequency || 'daily',
                runs_per_period: initialData.runs_per_period?.toString() || '',
                hours_per_run: initialData.hours_per_run?.toString() || '',
                staff_count: initialData.staff_count?.toString() || '',
                hourly_rate: initialData.hourly_rate?.toString() || '',
                implementation_cost: initialData.implementation_cost?.toString() || '',
                software_license_cost: initialData.software_license_cost?.toString() || '0',
                annual_maintenance_cost: initialData.annual_maintenance_cost?.toString() || '0',
                error_rate: initialData.error_rate?.toString() || '0',
                error_fix_cost: initialData.error_fix_cost?.toString() || '0',
                expected_labor_reduction: initialData.expected_labor_reduction || 70,
            });
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            ...formData,
            runs_per_period: parseInt(formData.runs_per_period) || 0,
            hours_per_run: parseFloat(formData.hours_per_run) || 0,
            staff_count: parseInt(formData.staff_count) || 0,
            hourly_rate: parseFloat(formData.hourly_rate) || 0,
            implementation_cost: parseFloat(formData.implementation_cost) || 0,
            software_license_cost: parseFloat(formData.software_license_cost) || 0,
            annual_maintenance_cost: parseFloat(formData.annual_maintenance_cost) || 0,
            error_rate: parseFloat(formData.error_rate) || 0,
            error_fix_cost: parseFloat(formData.error_fix_cost) || 0,
            expected_labor_reduction: parseFloat(formData.expected_labor_reduction) || 70,
        });
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            {/* Process Details */}
            <div className={styles.formGroup}>
                <label htmlFor="process_name">Process Name</label>
                <input
                    type="text"
                    id="process_name"
                    name="process_name"
                    value={formData.process_name}
                    onChange={handleChange}
                    placeholder="e.g. Invoice Processing"
                    required
                />
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="frequency">Frequency</label>
                    <select
                        id="frequency"
                        name="frequency"
                        value={formData.frequency}
                        onChange={handleChange}
                    >
                        {FREQUENCIES.map(f => (
                            <option key={f.value} value={f.value}>{f.label}</option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="runs_per_period">Runs per Period</label>
                    <input
                        type="number"
                        id="runs_per_period"
                        name="runs_per_period"
                        value={formData.runs_per_period}
                        onChange={handleChange}
                        placeholder="e.g. 20"
                        min="1"
                        required
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="hours_per_run">Hours per Run</label>
                    <input
                        type="number"
                        id="hours_per_run"
                        name="hours_per_run"
                        value={formData.hours_per_run}
                        onChange={handleChange}
                        placeholder="e.g. 0.5"
                        step="0.1"
                        min="0.1"
                        required
                    />
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="staff_count">Staff Count</label>
                    <input
                        type="number"
                        id="staff_count"
                        name="staff_count"
                        value={formData.staff_count}
                        onChange={handleChange}
                        placeholder="e.g. 3"
                        min="1"
                        required
                    />
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="hourly_rate">
                    Hourly Rate ($)
                    <span className={styles.hint}>Include benefits & overhead</span>
                </label>
                <input
                    type="number"
                    id="hourly_rate"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    placeholder="e.g. 35"
                    min="15"
                    required
                />
            </div>

            {/* Automation Investment Section */}
            <div className={styles.section}>
                <h3>Automation Investment</h3>

                <div className={styles.formGroup}>
                    <label htmlFor="implementation_cost">One-time Setup Cost ($)</label>
                    <input
                        type="number"
                        id="implementation_cost"
                        name="implementation_cost"
                        value={formData.implementation_cost}
                        onChange={handleChange}
                        placeholder="e.g. 25000"
                        min="0"
                        required
                    />
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="software_license_cost">
                            Annual License ($)
                            <span className={styles.optional}>optional</span>
                        </label>
                        <input
                            type="number"
                            id="software_license_cost"
                            name="software_license_cost"
                            value={formData.software_license_cost}
                            onChange={handleChange}
                            placeholder="e.g. 5000"
                            min="0"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="annual_maintenance_cost">
                            Annual Maintenance ($)
                            <span className={styles.optional}>optional</span>
                        </label>
                        <input
                            type="number"
                            id="annual_maintenance_cost"
                            name="annual_maintenance_cost"
                            value={formData.annual_maintenance_cost}
                            onChange={handleChange}
                            placeholder="e.g. 2000"
                            min="0"
                        />
                    </div>
                </div>
            </div>

            {/* Advanced Settings */}
            <details
                className={styles.advanced}
                open={showAdvanced}
                onToggle={(e) => setShowAdvanced(e.target.open)}
            >
                <summary>Advanced Settings</summary>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="error_rate">Error Rate (%)</label>
                        <input
                            type="number"
                            id="error_rate"
                            name="error_rate"
                            value={formData.error_rate}
                            onChange={handleChange}
                            placeholder="e.g. 5"
                            min="0"
                            max="50"
                            step="0.1"
                        />
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="error_fix_cost">Cost per Error ($)</label>
                        <input
                            type="number"
                            id="error_fix_cost"
                            name="error_fix_cost"
                            value={formData.error_fix_cost}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                            min="0"
                        />
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="expected_labor_reduction">
                        Expected Labor Reduction: <strong>{formData.expected_labor_reduction}%</strong>
                    </label>
                    <input
                        type="range"
                        id="expected_labor_reduction"
                        name="expected_labor_reduction"
                        value={formData.expected_labor_reduction}
                        onChange={handleChange}
                        min="10"
                        max="100"
                        className={styles.slider}
                    />
                </div>
            </details>

            <button type="submit" className={styles.submitBtn} disabled={isLoading}>
                {isLoading ? 'Calculating...' : 'Calculate ROI'}
            </button>
        </form>
    );
}
