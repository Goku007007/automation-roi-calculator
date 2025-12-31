import { forwardRef } from 'react';
import styles from './Input.module.css';

const Input = forwardRef(({
    label,
    id,
    name,
    type = 'text',
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helper,
    required = false,
    optional = false,
    disabled = false,
    className = '',
    min,
    max,
    step,
    ...props
}, ref) => {
    const inputId = id || name;
    const hasError = !!error;
    const errorId = hasError ? `${inputId}_error` : undefined;
    const helperId = helper ? `${inputId}_helper` : undefined;

    const inputClasses = [
        styles.input,
        hasError && styles.error,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.group}>
            {label && (
                <label htmlFor={inputId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                    {optional && <span className={styles.optional}>optional</span>}
                </label>
            )}
            <input
                ref={ref}
                type={type}
                id={inputId}
                name={name || id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                className={inputClasses}
                aria-invalid={hasError}
                aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
                min={min}
                max={max}
                step={step}
                {...props}
            />
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

Input.displayName = 'Input';

export default Input;
