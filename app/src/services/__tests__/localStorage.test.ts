import { describe, it, expect, beforeEach } from 'vitest';
import { localStorageService } from '../localStorage';
import { EMPTY_DATA, DATA_VERSION } from '../storage';

beforeEach(() => {
  localStorage.clear();
});

describe('localStorageService', () => {
  describe('load', () => {
    it('returns empty data when localStorage is empty', () => {
      const data = localStorageService.load();
      expect(data.clients).toEqual([]);
      expect(data.projects).toEqual([]);
      expect(data.proposals).toEqual([]);
    });

    it('loads saved data correctly', () => {
      const testData = {
        ...EMPTY_DATA,
        clients: [{ id: 'c1', name: 'Test Client', email: '', phone: '', projects: [], createdAt: '2026-01-01' }],
      };
      localStorage.setItem('fa360_data', JSON.stringify(testData));

      const loaded = localStorageService.load();
      expect(loaded.clients).toHaveLength(1);
      expect(loaded.clients[0].name).toBe('Test Client');
    });

    it('handles corrupted JSON gracefully', () => {
      localStorage.setItem('fa360_data', '{invalid json!!!');
      const data = localStorageService.load();
      expect(data.clients).toEqual([]);
    });

    it('handles partial data with missing fields', () => {
      localStorage.setItem('fa360_data', JSON.stringify({ clients: [{ id: 'x', name: 'Partial' }] }));
      const data = localStorageService.load();
      expect(data.clients).toHaveLength(1);
      expect(data.projects).toEqual([]);
      expect(data.mediaAssets).toEqual([]);
    });

    it('sets data version on load', () => {
      localStorage.setItem('fa360_data', JSON.stringify({ clients: [] }));
      const data = localStorageService.load();
      expect(data._version).toBe(DATA_VERSION);
    });
  });

  describe('save', () => {
    it('persists data to localStorage', () => {
      const testData = {
        ...EMPTY_DATA,
        clients: [{ id: 'c1', name: 'Saved Client', email: '', phone: '', projects: [], createdAt: '2026-01-01' }],
      };
      localStorageService.save(testData);

      const raw = JSON.parse(localStorage.getItem('fa360_data')!);
      expect(raw.clients).toHaveLength(1);
      expect(raw.clients[0].name).toBe('Saved Client');
      expect(raw._version).toBe(DATA_VERSION);
      expect(raw.exportedAt).toBeDefined();
    });
  });

  describe('importFromFile', () => {
    it('imports valid JSON file', async () => {
      const json = JSON.stringify({
        clients: [{ id: 'c1', name: 'Imported', email: '', phone: '', projects: [], createdAt: '2026-01-01' }],
        projects: [],
      });
      const file = new File([json], 'backup.json', { type: 'application/json' });

      const result = await localStorageService.importFromFile(file);
      expect(result.ok).toBe(true);
      expect(result.data?.clients).toHaveLength(1);
      expect(result.data?.clients[0].name).toBe('Imported');
    });

    it('rejects invalid JSON file', async () => {
      const file = new File(['not json'], 'bad.json', { type: 'application/json' });
      const result = await localStorageService.importFromFile(file);
      expect(result.ok).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});
