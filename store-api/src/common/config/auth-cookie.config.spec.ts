import {
  InvalidTokenLifetimeError,
  resolveAuthCookieMaxAge,
} from './auth-cookie.config';

describe('auth-cookie.config', () => {
  describe('resolveAuthCookieMaxAge', () => {
    it('parses ms unit', () => {
      expect(resolveAuthCookieMaxAge('500ms')).toBe(500);
    });

    it('parses seconds', () => {
      expect(resolveAuthCookieMaxAge('30s')).toBe(30_000);
    });

    it('parses minutes', () => {
      expect(resolveAuthCookieMaxAge('15m')).toBe(900_000);
    });

    it('parses hours', () => {
      expect(resolveAuthCookieMaxAge('1h')).toBe(3_600_000);
    });

    it('parses days', () => {
      expect(resolveAuthCookieMaxAge('7d')).toBe(604_800_000);
    });

    it('parses bare numbers as milliseconds (jsonwebtoken format)', () => {
      expect(resolveAuthCookieMaxAge('60000')).toBe(60_000);
    });

    it('handles surrounding whitespace and case-insensitive units', () => {
      expect(resolveAuthCookieMaxAge(' 2H ')).toBe(7_200_000);
    });

    it('throws on invalid values', () => {
      expect(() => resolveAuthCookieMaxAge('1y')).toThrow(
        InvalidTokenLifetimeError,
      );
      expect(() => resolveAuthCookieMaxAge('abc')).toThrow(
        InvalidTokenLifetimeError,
      );
      expect(() => resolveAuthCookieMaxAge('')).toThrow(
        InvalidTokenLifetimeError,
      );
    });
  });
});
