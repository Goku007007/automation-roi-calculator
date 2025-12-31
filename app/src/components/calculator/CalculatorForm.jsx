import { useState, useEffect } from 'react';
import Spinner from '../ui/Spinner';
import Button from '../ui/Button';
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

// Validation rules
const validate = (data) => {
    const errors = {};

    if (!data.process_name.trim()) {
        errors.process_name = 'Process name is required';
    }
    if (!data.runs_per_period || parseInt(data.runs_per_period) < 1) {
        errors.runs_per_period = 'Enter at least 1 run';
    }
    if (!data.hours_per_run || parseFloat(data.hours_per_run) < 0.1) {
        errors.hours_per_run = 'Enter time in hours (min 0.1)';
    }
    if (!data.staff_count || parseInt(data.staff_count) < 1) {
        errors.staff_count = 'Enter at least 1 person';
    }
    if (!data.hourly_rate || parseFloat(data.hourly_rate) < 1) {
        errors.hourly_rate = 'Enter hourly rate';
    }
    if (!data.implementation_cost && data.implementation_cost !== '0') {
        errors.implementation_cost = 'Enter setup cost (or 0)';
    }

    return errors;
};

export default function CalculatorForm({ onSubmit, isLoading, initialData }) {
    const [formData, setFormData] = useState(defaultFormData);
    const [showAdvanced, setShowAdvanced] = useState(false);
    const [errors, setErrors] = useState({});
    const [touched, setTouched] = useState({});

    // Load initial data when provided
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
            setErrors({});
            setTouched({});
        }
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: null }));
        }
    };

    const handleBlur = (e) => {
        const { name } = e.target;
        setTouched(prev => ({ ...prev, [name]: true }));

        // Validate single field on blur
        const fieldErrors = validate(formData);
        if (fieldErrors[name]) {
            setErrors(prev => ({ ...prev, [name]: fieldErrors[name] }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate all fields
        const validationErrors = validate(formData);
        setErrors(validationErrors);
        setTouched(Object.keys(formData).reduce((acc, key) => ({ ...acc, [key]: true }), {}));

        if (Object.keys(validationErrors).length > 0) {
            // Focus first error field
            const firstErrorField = Object.keys(validationErrors)[0];
            document.getElementById(firstErrorField)?.focus();
            return;
        }

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

    const getFieldClass = (name) => {
        if (touched[name] && errors[name]) return styles.inputError;
        if (touched[name] && !errors[name] && formData[name]) return styles.inputValid;
        return '';
    };

    return (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
            <p className={styles.requiredLegend}>* Required fields</p>

            {/* Process Details */}
            <div className={styles.formGroup}>
                <label htmlFor="process_name">
                    What process are you automating? *
                </label>
                <input
                    type="text"
                    id="process_name"
                    name="process_name"
                    value={formData.process_name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. Invoice Processing, Lead Routing"
                    className={getFieldClass('process_name')}
                    aria-invalid={!!errors.process_name}
                    aria-describedby={errors.process_name ? 'process_name_error' : undefined}
                />
                {touched.process_name && errors.process_name && (
                    <span id="process_name_error" className={styles.error}>{errors.process_name}</span>
                )}
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="frequency">How often does it run?</label>
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
                    <label htmlFor="runs_per_period">Runs per period *</label>
                    <input
                        type="number"
                        id="runs_per_period"
                        name="runs_per_period"
                        value={formData.runs_per_period}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 20"
                        min="1"
                        className={getFieldClass('runs_per_period')}
                        aria-invalid={!!errors.runs_per_period}
                    />
                    <span className={styles.helper}>Times per {formData.frequency.replace('_', ' ')}</span>
                    {touched.runs_per_period && errors.runs_per_period && (
                        <span className={styles.error}>{errors.runs_per_period}</span>
                    )}
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.formGroup}>
                    <label htmlFor="hours_per_run">Time per run (hours) *</label>
                    <input
                        type="number"
                        id="hours_per_run"
                        name="hours_per_run"
                        value={formData.hours_per_run}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 0.5"
                        step="0.1"
                        min="0.1"
                        className={getFieldClass('hours_per_run')}
                        aria-invalid={!!errors.hours_per_run}
                    />
                    <span className={styles.helper}>Include all manual steps</span>
                    {touched.hours_per_run && errors.hours_per_run && (
                        <span className={styles.error}>{errors.hours_per_run}</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="staff_count">People involved *</label>
                    <input
                        type="number"
                        id="staff_count"
                        name="staff_count"
                        value={formData.staff_count}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 3"
                        min="1"
                        className={getFieldClass('staff_count')}
                        aria-invalid={!!errors.staff_count}
                    />
                    <span className={styles.helper}>Who touches this process?</span>
                    {touched.staff_count && errors.staff_count && (
                        <span className={styles.error}>{errors.staff_count}</span>
                    )}
                </div>
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="hourly_rate">
                    Fully-loaded hourly rate ($) *
                </label>
                <input
                    type="number"
                    id="hourly_rate"
                    name="hourly_rate"
                    value={formData.hourly_rate}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder="e.g. 35"
                    min="1"
                    className={getFieldClass('hourly_rate')}
                    aria-invalid={!!errors.hourly_rate}
                />
                <span className={styles.helper}>Include benefits & overhead</span>
                {touched.hourly_rate && errors.hourly_rate && (
                    <span className={styles.error}>{errors.hourly_rate}</span>
                )}
            </div>

            {/* Automation Investment Section */}
            <div className={styles.section}>
                <h3>Automation Investment</h3>

                <div className={styles.formGroup}>
                    <label htmlFor="implementation_cost">One-time setup cost ($) *</label>
                    <input
                        type="number"
                        id="implementation_cost"
                        name="implementation_cost"
                        value={formData.implementation_cost}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        placeholder="e.g. 25000"
                        min="0"
                        className={getFieldClass('implementation_cost')}
                        aria-invalid={!!errors.implementation_cost}
                    />
                    <span className={styles.helper}>Development, training, migration</span>
                    {touched.implementation_cost && errors.implementation_cost && (
                        <span className={styles.error}>{errors.implementation_cost}</span>
                    )}
                </div>

                <div className={styles.row}>
                    <div className={styles.formGroup}>
                        <label htmlFor="software_license_cost">
                            Annual license ($)
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
                            Annual maintenance ($)
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
                        <label htmlFor="error_rate">Error rate (%)</label>
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
                        <span className={styles.helper}>Current manual error rate</span>
                    </div>

                    <div className={styles.formGroup}>
                        <label htmlFor="error_fix_cost">Cost per error ($)</label>
                        <input
                            type="number"
                            id="error_fix_cost"
                            name="error_fix_cost"
                            value={formData.error_fix_cost}
                            onChange={handleChange}
                            placeholder="e.g. 50"
                            min="0"
                        />
                        <span className={styles.helper}>Rework, fines, lost business</span>
                    </div>
                </div>

                <div className={styles.formGroup}>
                    <label htmlFor="expected_labor_reduction">
                        Expected labor reduction: <strong>{formData.expected_labor_reduction}%</strong>
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
                    <div className={styles.sliderLabels}>
                        <span>Conservative (10%)</span>
                        <span>Aggressive (100%)</span>
                    </div>
                </div>
            </details>

            <Button
                type="submit"
                variant="primary"
                size="lg"
                fullWidth
                loading={isLoading}
                disabled={isLoading}
            >
                Calculate Results
            </Button>
        </form>
    );
}
