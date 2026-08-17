export const AUTH_COOKIE_NAME = 'token';

export class InvalidTokenLifetimeError extends Error {
  constructor(value: string) {
    super(`Invalid JWT_EXPIRES_IN value: "${value}"`);
    this.name = 'InvalidTokenLifetimeError';
  }
}

export function resolveAuthCookieMaxAge(expiresIn: string): number {
  const match = /^(\d+)\s*(ms|s|m|h|d)?$/i.exec(expiresIn.trim());
  if (!match) {
    throw new InvalidTokenLifetimeError(expiresIn);
  }
  const [, amountRaw, unitRaw] = match;
  const amount = Number(amountRaw);
  const unitMultipliers: Record<string, number> = {
    ms: 1,
    s: 1000,
    m: 60_000,
    h: 3_600_000,
    d: 86_400_000,
  };
  return amount * unitMultipliers[unitRaw?.toLowerCase() ?? 'ms'];
}
