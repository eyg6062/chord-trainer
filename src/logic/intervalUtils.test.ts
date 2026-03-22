import { describe, it, expect } from 'vitest';
import { intervalToSemitone, getIntervalDegree } from './intervalUtils';

describe('intervalToSemitone', () => {
  it('maps basic intervals correctly', () => {
    expect(intervalToSemitone('1')).toBe(0);
    expect(intervalToSemitone('2')).toBe(2);
    expect(intervalToSemitone('3')).toBe(4);
    expect(intervalToSemitone('4')).toBe(5);
    expect(intervalToSemitone('5')).toBe(7);
    expect(intervalToSemitone('6')).toBe(9);
    expect(intervalToSemitone('7')).toBe(11);
  });

  it('maps flatted and sharped intervals correctly', () => {
    expect(intervalToSemitone('b3')).toBe(3);
    expect(intervalToSemitone('b5')).toBe(6);
    expect(intervalToSemitone('#5')).toBe(8);
    expect(intervalToSemitone('b7')).toBe(10);
  });

  it('maps bb7 (diminished seventh) to 9, same pitch class as 6', () => {
    expect(intervalToSemitone('bb7')).toBe(9);
    expect(intervalToSemitone('bb7')).toBe(intervalToSemitone('6'));
  });

  it('maps extended intervals to their pitch-class equivalents', () => {
    expect(intervalToSemitone('9')).toBe(intervalToSemitone('2'));   // 2
    expect(intervalToSemitone('b9')).toBe(intervalToSemitone('b2')); // 1
    expect(intervalToSemitone('#9')).toBe(intervalToSemitone('b3')); // 3
    expect(intervalToSemitone('11')).toBe(intervalToSemitone('4'));  // 5
    expect(intervalToSemitone('#11')).toBe(intervalToSemitone('b5'));// 6
    expect(intervalToSemitone('13')).toBe(intervalToSemitone('6'));  // 9
    expect(intervalToSemitone('b13')).toBe(intervalToSemitone('#5'));// 8
  });

  it('throws on an unrecognised interval string', () => {
    expect(() => intervalToSemitone('b4')).toThrow();
    expect(() => intervalToSemitone('')).toThrow();
    expect(() => intervalToSemitone('10')).toThrow();
  });
});

describe('getIntervalDegree', () => {
  it('returns the degree of plain intervals unchanged', () => {
    expect(getIntervalDegree('1')).toBe('1');
    expect(getIntervalDegree('5')).toBe('5');
    expect(getIntervalDegree('13')).toBe('13');
  });

  it('strips a single flat prefix', () => {
    expect(getIntervalDegree('b3')).toBe('3');
    expect(getIntervalDegree('b7')).toBe('7');
    expect(getIntervalDegree('b9')).toBe('9');
    expect(getIntervalDegree('b13')).toBe('13');
  });

  it('strips a single sharp prefix', () => {
    expect(getIntervalDegree('#5')).toBe('5');
    expect(getIntervalDegree('#9')).toBe('9');
    expect(getIntervalDegree('#11')).toBe('11');
  });

  it('strips a double flat prefix', () => {
    expect(getIntervalDegree('bb7')).toBe('7');
  });
});
