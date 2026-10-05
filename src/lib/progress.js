export const STORAGE_KEY = 'hungaryDocuments';
export const SCHEMA_VERSION_KEY = 'hungaryDocumentsVersion';
export const SCHEMA_VERSION = 1;
export const MAX_BACKUP_BYTES = 16_384;

/** Keep the current catalog authoritative; persisted content is untrusted. */
export function restoreDocuments(catalog, value) {
  const saved = new Map();
  if (Array.isArray(value)) {
    for (const item of value) {
      if (item && Number.isInteger(item.id) && typeof item.completed === 'boolean') {
        saved.set(item.id, item.completed);
      }
    }
  }
  return catalog.map(doc => ({ ...doc, completed: saved.get(doc.id) === true }));
}

export function readProgress(catalog, storage) {
  try {
    if (storage.getItem(SCHEMA_VERSION_KEY) !== String(SCHEMA_VERSION)) return restoreDocuments(catalog, []);
    return restoreDocuments(catalog, JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch {
    return restoreDocuments(catalog, []);
  }
}

export function saveProgress(documents, storage) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(documents.map(({ id, completed }) => ({ id, completed }))));
    storage.setItem(SCHEMA_VERSION_KEY, String(SCHEMA_VERSION));
    return true;
  } catch {
    return false;
  }
}

export function exportProgress(documents) {
  return JSON.stringify({
    app: 'hungary-tracker',
    version: SCHEMA_VERSION,
    documents: documents.map(({ id, completed }) => ({ id, completed })),
  }, null, 2);
}

export function importProgress(catalog, text) {
  if (new TextEncoder().encode(text).byteLength > MAX_BACKUP_BYTES) throw new Error('Backup is too large.');
  const data = JSON.parse(text);
  const validIds = new Set(catalog.map(doc => doc.id));
  if (!data || data.app !== 'hungary-tracker' || data.version !== SCHEMA_VERSION ||
    !Array.isArray(data.documents) || data.documents.length !== catalog.length ||
    new Set(data.documents.map(doc => doc?.id)).size !== catalog.length ||
    !data.documents.every(doc => doc && validIds.has(doc.id) && typeof doc.completed === 'boolean')) {
    throw new Error('Choose a valid Hungary Tracker backup.');
  }
  return restoreDocuments(catalog, data.documents);
}
