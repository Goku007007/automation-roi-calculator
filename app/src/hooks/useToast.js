import { useState, useCallback } from 'react';

export function useToast() {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success', duration = 3000) => {
        const id = crypto.randomUUID();
        setToasts(prev => [...prev, { id, message, type, duration }]);
        return id;
    }, []);

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    const success = useCallback((message) => addToast(message, 'success'), [addToast]);
    const error = useCallback((message) => addToast(message, 'error'), [addToast]);
    const warning = useCallback((message) => addToast(message, 'warning'), [addToast]);
    const info = useCallback((message) => addToast(message, 'info'), [addToast]);

    return { toasts, addToast, removeToast, success, error, warning, info };
}
