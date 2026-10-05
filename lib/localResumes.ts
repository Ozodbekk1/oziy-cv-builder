import type { ResumeData } from '@/components/resume/templates/types';

export interface StoredLocalResume {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
  template?: string;
  data: ResumeData & Record<string, unknown>;
}

const STORAGE_KEY = 'resumeitnow_local_resumes';

function canUseStorage() {
  return typeof window !== 'undefined';
}

export function getLocalResumes(): StoredLocalResume[] {
  if (!canUseStorage()) return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const resumes = raw ? JSON.parse(raw) : [];
    return Array.isArray(resumes) ? resumes : [];
  } catch (error) {
    console.error('[local-resumes] Failed to read local resumes:', error);
    return [];
  }
}

export function getLocalResume(id: string): StoredLocalResume | null {
  return getLocalResumes().find((resume) => resume.id === id) || null;
}

export function saveLocalResume(
  id: string,
  data: ResumeData,
  title: string,
  createdAt = new Date().toISOString()
) {
  if (!canUseStorage()) throw new Error('Local resume storage is unavailable.');
  const now = new Date().toISOString();
  const existing = getLocalResume(id);
  const resume: StoredLocalResume = {
    id,
    title,
    createdAt: existing?.createdAt || createdAt,
    updatedAt: now,
    template: data.template,
    data: { ...data, title, createdAt: existing?.createdAt || createdAt, updatedAt: now },
  };
  const resumes = getLocalResumes().filter((item) => item.id !== id);
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify([resume, ...resumes]));
  console.info('[local-resumes] Saved resume:', id);
  return resume;
}

export function updateLocalResume(id: string, patch: Record<string, unknown>) {
  const existing = getLocalResume(id);
  if (!existing) throw new Error(`Local resume "${id}" was not found.`);
  return saveLocalResume(
    id,
    { ...existing.data, ...patch } as ResumeData,
    String(patch.title || existing.title),
    existing.createdAt
  );
}

export function deleteLocalResume(id: string) {
  if (!canUseStorage()) return;
  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(getLocalResumes().filter((resume) => resume.id !== id))
  );
  console.info('[local-resumes] Deleted resume:', id);
}
