import { useState, useRef, useEffect } from 'react';
import { X, Plus } from 'lucide-react';
import Modal from '../shared/Modal';

export default function QuickNoteManager({ isOpen, onClose, category, tags, onAdd, onRemove }) {
  const [newTag, setNewTag] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setNewTag('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleAdd = () => {
    const trimmed = newTag.trim();
    if (!trimmed) return;
    onAdd(category, trimmed);
    setNewTag('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') handleAdd();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Manage Tags">
      {/* Existing tags */}
      <div className="flex flex-wrap gap-2 mb-6 min-h-[48px]">
        {tags.length === 0 && (
          <p className="text-sm text-text-muted">No quick notes yet. Add one below.</p>
        )}
        {tags.map(tag => (
          <span
            key={tag}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-surface
              text-sm font-medium text-text-secondary"
          >
            {tag}
            <button
              onClick={() => onRemove(category, tag)}
              className="flex items-center justify-center w-5 h-5 rounded-full
                hover:bg-[var(--c-hover)] transition-colors"
              aria-label={`Remove ${tag}`}
            >
              <X size={12} />
            </button>
          </span>
        ))}
      </div>

      {/* Add new tag */}
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={newTag}
          onChange={(e) => setNewTag(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Enter a new tag..."
          className="flex-1 px-4 py-3 rounded-2xl bg-surface text-text-primary text-sm
            focus:outline-none focus:ring-2 focus:ring-primary"
        />
        <button
          onClick={handleAdd}
          disabled={!newTag.trim()}
          className="flex items-center gap-1.5 px-5 py-3 rounded-2xl bg-primary hover:bg-primary-light
            text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <Plus size={16} />
          Add
        </button>
      </div>
    </Modal>
  );
}
