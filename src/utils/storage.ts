const STORAGE_KEY = 'suriname-property-saved';
const RECENT_KEY = 'suriname-property-recent';

export function getSavedIds(): string[] {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

export function saveProperty(id: string): void {
  const saved = getSavedIds();
  if (!saved.includes(id)) {
    saved.push(id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
  }
}

export function unsaveProperty(id: string): void {
  const saved = getSavedIds().filter(s => s !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

export function isSaved(id: string): boolean {
  return getSavedIds().includes(id);
}

export function toggleSaved(id: string): boolean {
  if (isSaved(id)) {
    unsaveProperty(id);
    return false;
  } else {
    saveProperty(id);
    return true;
  }
}

// Recently viewed
export function getRecentIds(): string[] {
  try {
    const recent = localStorage.getItem(RECENT_KEY);
    return recent ? JSON.parse(recent) : [];
  } catch {
    return [];
  }
}

export function addRecent(id: string): void {
  const recent = getRecentIds().filter(r => r !== id);
  recent.unshift(id);
  if (recent.length > 10) recent.pop();
  localStorage.setItem(RECENT_KEY, JSON.stringify(recent));
}
