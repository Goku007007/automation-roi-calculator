import { useState } from 'react';
import styles from './ScenarioTabs.module.css';

const SCENARIOS = [
    { id: 'base', label: 'Base Case', description: 'Your expected scenario' },
    { id: 'best', label: 'Best Case', description: 'Optimistic assumptions' },
    { id: 'worst', label: 'Worst Case', description: 'Conservative assumptions' },
];

export default function ScenarioTabs({
    activeScenario,
    scenarios,
    onScenarioChange,
    onCreateScenario
}) {
    return (
        <div className={styles.container}>
            <div className={styles.tabs}>
                {SCENARIOS.map(scenario => {
                    const hasData = scenarios && scenarios[scenario.id];
                    const isActive = activeScenario === scenario.id;

                    return (
                        <button
                            key={scenario.id}
                            className={`${styles.tab} ${isActive ? styles.active : ''} ${hasData ? styles.hasData : ''}`}
                            onClick={() => onScenarioChange(scenario.id)}
                        >
                            <span className={styles.label}>{scenario.label}</span>
                            {hasData && (
                                <span className={styles.badge}>✓</span>
                            )}
                        </button>
                    );
                })}
            </div>

            {activeScenario && !scenarios?.[activeScenario] && (
                <div className={styles.hint}>
                    <p>
                        Adjust inputs above for <strong>{SCENARIOS.find(s => s.id === activeScenario)?.label}</strong>
                        {' '}and click Calculate to save this scenario.
                    </p>
                </div>
            )}
        </div>
    );
}
