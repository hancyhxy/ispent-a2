import Modal from './Modal';
import { useRef, useEffect } from 'react';

export default function ConfirmDialog({ isOpen, onClose, onConfirm, title, message }) {
  const cancelRef = useRef(null);

  useEffect(() => {
    if (isOpen) cancelRef.current?.focus();
  }, [isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-text-secondary text-sm mb-6">{message}</p>
      <div className="flex gap-3 justify-end">
        <button
          ref={cancelRef}
          onClick={onClose}
          className="px-6 py-3 rounded-2xl text-sm font-semibold text-text-secondary
            bg-surface hover:bg-[var(--c-hover)] transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className="px-6 py-3 rounded-2xl text-sm font-semibold text-white
            bg-error hover:bg-red-700 transition-colors"
        >
          Delete
        </button>
      </div>
    </Modal>
  );
}
