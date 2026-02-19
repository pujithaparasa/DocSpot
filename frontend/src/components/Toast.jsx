import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

const icons = { success: CheckCircle, error: XCircle, warning: AlertCircle };
const colors = { success: '#10b981', error: '#ef4444', warning: '#f59e0b' };

let toastFn;
export const toast = {
    success: (msg) => toastFn?.('success', msg),
    error: (msg) => toastFn?.('error', msg),
    warning: (msg) => toastFn?.('warning', msg),
};

export const ToastContainer = () => {
    const [toasts, setToasts] = useState([]);

    useEffect(() => {
        toastFn = (type, message) => {
            const id = Date.now();
            setToasts(prev => [...prev, { id, type, message }]);
            setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000);
        };
    }, []);

    return (
        <div className="toast-container">
            {toasts.map(t => {
                const Icon = icons[t.type];
                return (
                    <div key={t.id} className={`toast toast-${t.type}`}>
                        <Icon size={18} color={colors[t.type]} />
                        <span>{t.message}</span>
                        <button onClick={() => setToasts(prev => prev.filter(x => x.id !== t.id))}>
                            <X size={14} />
                        </button>
                    </div>
                );
            })}
        </div>
    );
};
