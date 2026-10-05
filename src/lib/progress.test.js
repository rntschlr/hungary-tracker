import { describe, expect, test } from 'vitest';
import { restoreDocuments, readProgress, saveProgress, exportProgress, importProgress } from './progress';
const catalog = [{ id: 1, title: 'Passport', completed: false }, { id: 2, title: 'Photo', completed: false }];

describe('progress data boundaries', () => {
  test.each([null, {}, 'broken', [null], [{ id: 1, completed: 'false' }], [{ id: 1, completed: 1 }]])('rejects malformed saved data: %j', value => {
    expect(restoreDocuments(catalog, value)).toEqual(catalog);
  });
  test('restores only known booleans and preserves the authoritative catalog', () => {
    const restored = restoreDocuments(catalog, [{ id: 1, completed: true, title: 'Injected' }, { id: 99, completed: true }]);
    expect(restored).toEqual([{ ...catalog[0], completed: true }, catalog[1]]);
    expect(catalog[0].completed).toBe(false);
  });
  test('handles inaccessible storage and corrupt JSON', () => {
    const blocked = { getItem() { throw new Error('blocked'); }, setItem() { throw new Error('quota'); } };
    expect(readProgress(catalog, blocked)).toEqual(catalog);
    expect(saveProgress(catalog, blocked)).toBe(false);
    expect(readProgress(catalog, { getItem: key => key.endsWith('Version') ? '1' : '{' })).toEqual(catalog);
  });
  test('backup round trips completion without storing document text', () => {
    const docs = [{ ...catalog[0], completed: true }, catalog[1]];
    const backup = exportProgress(docs);
    expect(backup).not.toContain('Passport');
    expect(importProgress(catalog, backup)).toEqual(docs);
  });
  test.each([
    { app: 'another-app', version: 1, documents: catalog },
    { app: 'hungary-tracker', version: 99, documents: catalog },
    { app: 'hungary-tracker', version: 1, documents: [catalog[0], catalog[0]] },
    { app: 'hungary-tracker', version: 1, documents: [{ id: 1, completed: 'false' }, catalog[1]] },
    { app: 'hungary-tracker', version: 1, documents: [] },
  ])('rejects incompatible backups without changing progress', value => {
    expect(() => importProgress(catalog, JSON.stringify(value))).toThrow();
    expect(catalog.every(doc => doc.completed === false)).toBe(true);
  });
  test('rejects oversized backup before parsing', () => {
    expect(() => importProgress(catalog, 'é'.repeat(9000))).toThrow('Backup is too large');
  });
});
