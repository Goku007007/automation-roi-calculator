import { useState, useEffect, useMemo } from 'react';
import { calculateROIClient } from '../../utils/api';
import { ChevronDownIcon, ChevronUpIcon } from '../ui/Icons';
import styles from './WhatIfSliders.module.css';

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

// Slider configurations
const SLIDERS = [
    {
        key: 'expected_labor_reduction',
        label: 'Labor Reduction',
        unit: '%',
        min: 0,
        max: 100,
        step: 5,
        defaultValue: 70,
    },
    {
        key: 'implementation_cost',
        label: 'Implementation Cost',
        unit: '$',
        min: 0,
        max: 100000,
        step: 1000,
        defaultValue: 15000,
        format: 'currency',
    },
    {
        key: 'hourly_rate',
        label: 'Hourly Rate',
        unit: '$/hr',
        min: 20,
        max: 200,
        step: 5,
        defaultValue: 50,
    },
    {
        key: 'staff_count',
        label: 'Staff Involved',
        unit: 'people',
        min: 1,
        max: 20,
        step: 1,
        defaultValue: 3,
    },
];

export default function WhatIfSliders({ formData, originalResults }) {
    const [sliderValues, setSliderValues] = useState({});
    const [isExpanded, setIsExpanded] = useState(false);

    // Initialize slider values from form data
    useEffect(() => {
        if (formData) {
            const initial = {};
            SLIDERS.forEach(slider => {
                initial[slider.key] = formData[slider.key] ?? slider.defaultValue;
            });
            setSliderValues(initial);
        }
    }, [formData]);

    // Calculate updated results when sliders change
    const updatedResults = useMemo(() => {
        if (!formData || Object.keys(sliderValues).length === 0) return null;

        const adjustedData = { ...formData, ...sliderValues };
        return calculateROIClient(adjustedData);
    }, [formData, sliderValues]);

    // Check if values have changed from original
    const hasChanges = useMemo(() => {
        if (!formData) return false;
        return SLIDERS.some(slider => {
            const original = formData[slider.key] ?? slider.defaultValue;
            const current = sliderValues[slider.key] ?? slider.defaultValue;
            return original !== current;
        });
    }, [formData, sliderValues]);

    const handleSliderChange = (key, value) => {
        setSliderValues(prev => ({ ...prev, [key]: parseFloat(value) }));
    };

    const handleReset = () => {
        if (formData) {
            const reset = {};
            SLIDERS.forEach(slider => {
                reset[slider.key] = formData[slider.key] ?? slider.defaultValue;
            });
            setSliderValues(reset);
        }
    };

    if (!formData || !originalResults) return null;

    const roi = updatedResults?.roi_percentage ?? originalResults.roi_percentage;
    const savings = updatedResults?.net_annual_savings ?? originalResults.net_annual_savings ?? originalResults.annual_savings;
    const payback = updatedResults?.payback_period_months ?? originalResults.payback_months;

    const roiDiff = roi - (originalResults.roi_percentage || 0);
    const savingsDiff = savings - (originalResults.net_annual_savings || originalResults.annual_savings || 0);

    return (
        <div className={styles.container}>
            <button
                className={styles.toggleBtn}
                onClick={() => setIsExpanded(!isExpanded)}
                type="button"
                aria-expanded={isExpanded}
            >
                <span className={styles.toggleIcon}>
                    {isExpanded ? <ChevronUpIcon size={16} /> : <ChevronDownIcon size={16} />}
                </span>
                <h3 className={styles.heading}>What-If Analysis</h3>
                {hasChanges && <span className={styles.changedBadge}>Modified</span>}
            </button>

            {isExpanded && (
                <div className={styles.content}>
                    <p className={styles.description}>
                        Adjust the sliders below to see how changes affect your ROI in real-time.
                    </p>

                    {/* Sliders */}
                    <div className={styles.sliders}>
                        {SLIDERS.map(slider => {
                            const value = sliderValues[slider.key] ?? slider.defaultValue;
                            const original = formData[slider.key] ?? slider.defaultValue;
                            const isChanged = value !== original;

                            return (
                                <div key={slider.key} className={styles.sliderGroup}>
                                    <div className={styles.sliderHeader}>
                                        <label htmlFor={slider.key}>{slider.label}</label>
                                        <span className={`${styles.sliderValue} ${isChanged ? styles.changed : ''}`}>
                                            {slider.format === 'currency'
                                                ? formatCurrency(value)
                                                : `${value}${slider.unit === '%' ? '%' : ` ${slider.unit}`}`}
                                        </span>
                                    </div>
                                    <input
                                        type="range"
                                        id={slider.key}
                                        min={slider.min}
                                        max={slider.max}
                                        step={slider.step}
                                        value={value}
                                        onChange={(e) => handleSliderChange(slider.key, e.target.value)}
                                        className={styles.slider}
                                    />
                                    <div className={styles.sliderRange}>
                                        <span>{slider.format === 'currency' ? formatCurrency(slider.min) : slider.min}</span>
                                        <span>{slider.format === 'currency' ? formatCurrency(slider.max) : slider.max}</span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Results Preview */}
                    <div className={styles.preview}>
                        <h4>Projected Impact</h4>
                        <div className={styles.previewMetrics}>
                            <div className={styles.previewMetric}>
                                <span className={styles.previewLabel}>ROI</span>
                                <span className={styles.previewValue}>{Math.round(roi)}%</span>
                                {roiDiff !== 0 && (
                                    <span className={`${styles.diff} ${roiDiff > 0 ? styles.positive : styles.negative}`}>
                                        {roiDiff > 0 ? '+' : ''}{Math.round(roiDiff)}%
                                    </span>
                                )}
                            </div>
                            <div className={styles.previewMetric}>
                                <span className={styles.previewLabel}>Annual Savings</span>
                                <span className={styles.previewValue}>{formatCurrency(savings)}</span>
                                {savingsDiff !== 0 && (
                                    <span className={`${styles.diff} ${savingsDiff > 0 ? styles.positive : styles.negative}`}>
                                        {savingsDiff > 0 ? '+' : ''}{formatCurrency(savingsDiff)}
                                    </span>
                                )}
                            </div>
                            <div className={styles.previewMetric}>
                                <span className={styles.previewLabel}>Payback</span>
                                <span className={styles.previewValue}>
                                    {payback > 0 ? `${Math.round(payback * 10) / 10} mo` : '—'}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Reset Button */}
                    {hasChanges && (
                        <button
                            type="button"
                            className={styles.resetBtn}
                            onClick={handleReset}
                        >
                            Reset to Original Values
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
