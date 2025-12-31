import { forwardRef } from 'react';
import styles from './Select.module.css';

const Select = forwardRef(({
    label,
    id,
    name,
    value,
    onChange,
    onBlur,
    options = [],
    placeholder,
    error,
    helper,
    required = false,
    optional = false,
    disabled = false,
    className = '',
    ...props
}, ref) => {
    const selectId = id || name;
    const hasError = !!error;
    const errorId = hasError ? `${selectId}_error` : undefined;
    const helperId = helper ? `${selectId}_helper` : undefined;

    const selectClasses = [
        styles.select,
        hasError && styles.error,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.group}>
            {label && (
                <label htmlFor={selectId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                    {optional && <span className={styles.optional}>optional</span>}
                </label>
            )}
            <select
                ref={ref}
                id={selectId}
                name={name || id}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={selectClasses}
                aria-invalid={hasError}
                aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
                {...props}
            >
                {placeholder && (
                    <option value="" disabled>{placeholder}</option>
                )}
                {options.map(opt => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {helper && !hasError && (
                <span id={helperId} className={styles.helper}>{helper}</span>
            )}
            {hasError && (
                <span id={errorId} className={styles.errorText} role="alert">
                    {error}
                </span>
            )}
        </div>
    );
});

Select.displayName = 'Select';

export default Select;
