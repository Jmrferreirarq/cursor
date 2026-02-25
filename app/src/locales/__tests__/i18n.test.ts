import { describe, it, expect } from 'vitest';
import { t, formatCurrency, formatDate } from '../index';

describe('i18n', () => {
  describe('t() translation function', () => {
    it('translates nav keys in Portuguese', () => {
      expect(t('nav.dashboard', 'pt')).toBe('Início');
      expect(t('nav.projects', 'pt')).toBe('Projectos');
      expect(t('nav.clients', 'pt')).toBe('Clientes');
    });

    it('translates nav keys in English', () => {
      expect(t('nav.dashboard', 'en')).toBe('Home');
      expect(t('nav.projects', 'en')).toBe('Projects');
      expect(t('nav.clients', 'en')).toBe('Clients');
    });

    it('translates nested settings keys', () => {
      expect(t('settings.title', 'pt')).toBe('Definições');
      expect(t('settings.title', 'en')).toBe('Settings');
      expect(t('settings.backup', 'pt')).toBe('Backup & Restore');
    });

    it('translates common action keys', () => {
      expect(t('common.save', 'pt')).toBe('Guardar');
      expect(t('common.save', 'en')).toBe('Save');
      expect(t('common.cancel', 'pt')).toBe('Cancelar');
      expect(t('common.cancel', 'en')).toBe('Cancel');
    });

    it('falls back to Portuguese when key missing in English', () => {
      expect(t('proposal.title', 'pt')).toBe('Orçamento de Honorários');
      expect(t('proposal.title', 'en')).toBe('Fee Proposal');
    });

    it('returns key when translation not found in any language', () => {
      expect(t('nonexistent.key', 'pt')).toBe('nonexistent.key');
      expect(t('nonexistent.key', 'en')).toBe('nonexistent.key');
    });

    it('translates pages keys', () => {
      expect(t('pages.notFound', 'pt')).toBe('Página não encontrada');
      expect(t('pages.notFound', 'en')).toBe('Page not found');
    });
  });

  describe('formatCurrency', () => {
    it('formats EUR in Portuguese', () => {
      const result = formatCurrency(1234.56, 'pt');
      expect(result).toContain('€');
    });

    it('formats EUR in English', () => {
      const result = formatCurrency(1234.56, 'en');
      expect(result).toContain('€');
    });
  });

  describe('formatDate', () => {
    it('formats date in Portuguese', () => {
      const date = new Date(2026, 1, 25);
      const result = formatDate(date, 'pt');
      expect(result).toContain('2026');
      expect(result).toContain('25');
    });

    it('formats date in English', () => {
      const date = new Date(2026, 1, 25);
      const result = formatDate(date, 'en');
      expect(result).toContain('2026');
      expect(result).toContain('25');
    });
  });
});
