import { forwardRef } from 'react';
import styles from './Textarea.module.css';

const Textarea = forwardRef(({
    label,
    id,
    name,
    placeholder,
    value,
    onChange,
    onBlur,
    error,
    helper,
    required = false,
    optional = false,
    disabled = false,
    rows = 4,
    className = '',
    ...props
}, ref) => {
    const textareaId = id || name;
    const hasError = !!error;
    const errorId = hasError ? `${textareaId}_error` : undefined;
    const helperId = helper ? `${textareaId}_helper` : undefined;

    const textareaClasses = [
        styles.textarea,
        hasError && styles.error,
        className
    ].filter(Boolean).join(' ');

    return (
        <div className={styles.group}>
            {label && (
                <label htmlFor={textareaId} className={styles.label}>
                    {label}
                    {required && <span className={styles.required}>*</span>}
                    {optional && <span className={styles.optional}>optional</span>}
                </label>
            )}
            <textarea
                ref={ref}
                id={textareaId}
                name={name || id}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                disabled={disabled}
                rows={rows}
                className={textareaClasses}
                aria-invalid={hasError}
                aria-describedby={[errorId, helperId].filter(Boolean).join(' ') || undefined}
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

Textarea.displayName = 'Textarea';

export default Textarea;
