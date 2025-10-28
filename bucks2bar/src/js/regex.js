// Regex for username validation
// Must contain at least one uppercase letter, one lowercase letter, one digit, one special character, and be at least 8 characters long
const USERNAME_REGEX = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&~])[A-Za-z\d@$!%*?&~]{8,}$/;

module.exports = {
    USERNAME_REGEX
};
