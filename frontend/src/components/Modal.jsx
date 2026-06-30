import { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import '../styles/components/Modal.css';
import '../styles/components/Button.css';

export default function Modal({ title, message, onConfirm, onCancel, confirmLabel = 'Delete', isLoading = false }) {
  // Close on Escape key
  useEffect(() => {
    const handle = (e) => { if (e.key === 'Escape') onCancel(); };
    document.addEventListener('keydown', handle);
    return () => document.removeEventListener('keydown', handle);
  }, [onCancel]);

  return (
    <div className="modal-backdrop" onClick={(e) => { if (e.target === e.currentTarget) onCancel(); }}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal__icon modal__icon--danger">
          <AlertTriangle size={28} />
        </div>

        <h3 className="modal__title" id="modal-title">{title}</h3>
        <p className="modal__body">{message}</p>

        <div className="modal__actions">
          <button className="btn btn--secondary" onClick={onCancel} disabled={isLoading}>
            Cancel
          </button>
          <button
            className={`btn btn--danger${isLoading ? ' btn--loading' : ''}`}
            onClick={onConfirm}
            disabled={isLoading}
          >
            {!isLoading && confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
