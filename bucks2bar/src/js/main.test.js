// Extract the regex from main.js for testing
const usernameRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

describe('username validation regex', () => {
  test('valid username passes', () => {
    expect(usernameRegex.test('Abcdef1!')).toBe(true);
    expect(usernameRegex.test('Password1@')).toBe(true);
  });

  test('missing uppercase fails', () => {
    expect(usernameRegex.test('abcdef1!')).toBe(false);
  });

  test('missing number fails', () => {
    expect(usernameRegex.test('Abcdefg!')).toBe(false);
  });

  test('missing special character fails', () => {
    expect(usernameRegex.test('Abcdef12')).toBe(false);
  });

  test('too short fails', () => {
    expect(usernameRegex.test('A1!a')).toBe(false);
  });
});