
const { USERNAME_REGEX } = require('./regex');

describe('username validation regex', () => {
  test('valid username passes', () => {
    expect(USERNAME_REGEX.test('Abcdef1!')).toBe(true);
    expect(USERNAME_REGEX.test('Password1@')).toBe(true);
  });

  test('missing uppercase fails', () => {
    expect(USERNAME_REGEX.test('abcdef1!')).toBe(false);
  });

  test('missing number fails', () => {
    expect(USERNAME_REGEX.test('Abcdefg!')).toBe(false);
  });

  test('missing special character fails', () => {
    expect(USERNAME_REGEX.test('Abcdef12')).toBe(false);
  });

  test('too short fails', () => {
    expect(USERNAME_REGEX.test('A1!a')).toBe(false);
  });

  test('missing lowercase fails', () => {
    expect(USERNAME_REGEX.test('ABCDEFG1!')).toBe(false);
  });
});