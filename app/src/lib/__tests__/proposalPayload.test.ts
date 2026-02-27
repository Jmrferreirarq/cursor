import { describe, it, expect } from 'vitest';
import { encodeProposalPayload, decodeProposalPayload, formatCurrency } from '../proposalPayload';

const validPayload = {
  branding: { appName: 'Test Studio' },
  ref: 'REF-001',
  data: '2026-02-25',
  cliente: 'Cliente Teste',
  projeto: 'Moradia T3',
  local: 'Aveiro',
  modo: 'percentagem',
  tipologia: 'Habitação Unifamiliar',
  fasesPct: 100,
  localizacao: 'Aveiro',
  iva: '23',
  valorArq: 5000,
  valorEsp: 2000,
  valorExtras: 500,
  total: 9225,
};

describe('proposalPayload', () => {
  describe('encode + decode roundtrip', () => {
    it('encodes and decodes a valid payload', () => {
      const encoded = encodeProposalPayload(validPayload as any);
      expect(encoded).toBeTruthy();
      expect(typeof encoded).toBe('string');

      const decoded = decodeProposalPayload(encoded);
      expect(decoded).not.toBeNull();
      expect(decoded?.ref).toBe('REF-001');
      expect(decoded?.cliente).toBe('Cliente Teste');
      expect(decoded?.projeto).toBe('Moradia T3');
      expect(decoded?.total).toBe(9225);
    });

    it('preserves branding through encode/decode', () => {
      const encoded = encodeProposalPayload(validPayload as any);
      const decoded = decodeProposalPayload(encoded);
      expect(decoded?.branding.appName).toBe('Test Studio');
    });

    it('produces a compressed string shorter than raw JSON', () => {
      const encoded = encodeProposalPayload(validPayload as any);
      const rawJson = JSON.stringify(validPayload);
      expect(encoded.length).toBeLessThan(rawJson.length);
    });
  });

  describe('decodeProposalPayload edge cases', () => {
    it('returns null for empty string', () => {
      expect(decodeProposalPayload('')).toBeNull();
    });

    it('returns null for garbage input', () => {
      expect(decodeProposalPayload('!@#$%^&*')).toBeNull();
    });

    it('returns null for valid JSON but invalid schema', () => {
      const encoded = btoa(JSON.stringify({ notValid: true }));
      expect(decodeProposalPayload(encoded)).toBeNull();
    });
  });

  describe('formatCurrency', () => {
    it('formats in Portuguese locale', () => {
      const result = formatCurrency(1500, 'pt');
      expect(result).toContain('1');
      expect(result).toContain('500');
      expect(result).toContain('€');
    });

    it('formats in English locale', () => {
      const result = formatCurrency(1500, 'en');
      expect(result).toContain('1');
      expect(result).toContain('500');
      expect(result).toContain('€');
    });

    it('formats zero correctly', () => {
      const result = formatCurrency(0, 'pt');
      expect(result).toContain('0');
      expect(result).toContain('€');
    });
  });
});
