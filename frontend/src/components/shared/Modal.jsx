/* Author: Xinyi */
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

export default function Modal({ isOpen, onClose, title, footer, children }) {
  const modalRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);

    // Focus trap
    const focusableEls = modalRef.current?.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableEls?.length) focusableEls[0].focus();

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" />

      {/* Modal content */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        onClick={(e) => e.stopPropagation()}
        className="relative bg-card z-10 w-full md:w-auto md:min-w-[480px] md:max-w-[560px]
          rounded-t-3xl md:rounded-3xl max-h-[90vh] flex flex-col
          shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.02)]
          transition-transform duration-200 ease-out"
      >
        {title && (
          <div className="relative flex items-center px-8 py-5 md:block">
            <button
              onClick={onClose}
              className="md:hidden flex items-center justify-center w-8 h-8 rounded-full
                hover:bg-[var(--c-hover)] text-text-muted transition-colors focus:outline-none"
              aria-label="Close"
            >
              <X size={20} />
            </button>
            <h2 className="absolute left-1/2 -translate-x-1/2 text-xl font-semibold text-text-primary
              md:static md:translate-x-0"
            >
              {title}
            </h2>
          </div>
        )}
        <div className={`flex-1 overflow-y-auto px-8 ${title ? 'pt-2 md:pt-6' : 'pt-8'} ${footer ? 'pb-4' : 'pb-8'}`}>
          {children}
        </div>
        {footer && (
          <div className="px-8 pb-8 pt-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
