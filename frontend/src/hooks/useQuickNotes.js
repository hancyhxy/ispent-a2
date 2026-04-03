import { useState, useCallback } from 'react';

const STORAGE_KEY = 'ispent_quick_notes';

const DEFAULT_TAGS = {
  food: ['lunch', 'dinner', 'grocery', 'snack'],
  shopping: ['clothes', 'electronics', 'gift'],
  transport: ['bus', 'taxi', 'fuel'],
  entertainment: ['subscription', 'movies', 'games'],
  housing: ['rent', 'utilities', 'furniture'],
  education: ['tuition', 'books', 'course'],
  health: ['medicine', 'checkup', 'gym'],
  daily: ['toiletries', 'cleaning'],
  other: ['misc'],
  salary: ['monthly'],
  freelance: ['project', 'consulting'],
  transfer: ['family', 'friend'],
  refund: ['return'],
  other_income: ['bonus', 'interest'],
};

function loadTags() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return { ...DEFAULT_TAGS };
}

function saveTags(tags) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tags));
}

export default function useQuickNotes() {
  const [allTags, setAllTags] = useState(loadTags);

  const getTags = useCallback((category) => {
    return allTags[category] || [];
  }, [allTags]);

  const addTag = useCallback((category, tag) => {
    const trimmed = tag.trim().toLowerCase();
    if (!trimmed) return false;

    setAllTags(prev => {
      const current = prev[category] || [];
      if (current.includes(trimmed)) return prev;
      const updated = { ...prev, [category]: [...current, trimmed] };
      saveTags(updated);
      return updated;
    });
    return true;
  }, []);

  const removeTag = useCallback((category, tag) => {
    setAllTags(prev => {
      const current = prev[category] || [];
      const updated = { ...prev, [category]: current.filter(t => t !== tag) };
      saveTags(updated);
      return updated;
    });
  }, []);

  return { getTags, addTag, removeTag };
}
