import { safeParseJson } from './storage';

describe('safeParseJson', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('returns fallback when key does not exist', () => {
    expect(safeParseJson('missing', 'default')).toBe('default');
  });

  it('parses valid JSON', () => {
    localStorage.setItem('key', JSON.stringify({ a: 1 }));
    expect(safeParseJson('key', {})).toEqual({ a: 1 });
  });

  it('returns fallback on parse error', () => {
    localStorage.setItem('key', 'not json');
    expect(safeParseJson('key', 'fallback')).toBe('fallback');
  });

  it('returns fallback when validator rejects', () => {
    localStorage.setItem('key', JSON.stringify('string'));
    const validator = (v: unknown): v is number => typeof v === 'number';
    expect(safeParseJson('key', 0, validator)).toBe(0);
  });
});
