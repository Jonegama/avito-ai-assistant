import type { UpdateItemPayload } from '../types/item';

function getDraftKey(id: string) {
  return `ad-edit-draft-${id}`;
}

export function saveDraft(id: string, data: UpdateItemPayload) {
  localStorage.setItem(getDraftKey(id), JSON.stringify(data));
}

export function loadDraft(id: string): UpdateItemPayload | null {
  const raw = localStorage.getItem(getDraftKey(id));

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as UpdateItemPayload;
  } catch {
    return null;
  }
}

export function clearDraft(id: string) {
  localStorage.removeItem(getDraftKey(id));
}