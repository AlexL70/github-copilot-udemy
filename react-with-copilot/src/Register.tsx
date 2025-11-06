import { useState } from "react";

function Register() {
  // two state items: username and mobile number
  const [username, setUsername] = useState("");
  const [ukMobile, setUkMobile] = useState("");
  // two state items for username and mobile validation errors
  const [usernameError, setUsernameError] = useState("");
  const [ukMobileError, setUkMobileError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log({ username, ukMobile });
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit} style={{ maxWidth: 400, margin: "0 auto" }}>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="username">Username</label>
          <br />
          <input
            type="text"
            id="username"
            name="username"
            value={username}
            onChange={(e) => {
              const value = e.target.value;
              setUsername(value);
              // validate username: must be at least 8 characters long,
              // must have at least one lowercase letter, one uppercase letter,
              // one digit, and one special character (including #)
              const usernameValid =
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/.test(
                  value
                );
              setUsernameError(
                usernameValid
                  ? ""
                  : "Invalid username: must be at least 8 characters long and include uppercase, lowercase, digit, and special character."
              );
            }}
            required
            style={{ width: "100%", padding: 8 }}
          />
          {usernameError && (
            <div style={{ color: "red", marginTop: 4 }}>{usernameError}</div>
          )}
        </div>
        <div style={{ marginBottom: 16 }}>
          <label htmlFor="ukMobile">UK Mobile Number</label>
          <br />
          <input
            type="tel"
            id="ukMobile"
            name="ukMobile"
            value={ukMobile}
            onChange={(e) => {
              const value = e.target.value;
              setUkMobile(value);
              // validate UK mobile number must start with 07 and be 11 digits long
              const ukMobileValid = /^07\d{9}$/.test(value);
              setUkMobileError(
                ukMobileValid ? "" : "Invalid UK mobile number format."
              );
            }}
            placeholder="07 XXX XXXXXX"
            required
            style={{ width: "100%", padding: 8 }}
          />
          {ukMobileError && (
            <div style={{ color: "red", marginTop: 4 }}>{ukMobileError}</div>
          )}
        </div>
        <button type="submit" style={{ padding: "8px 16px" }}>
          Submit
        </button>
      </form>
    </div>
  );
}

export default Register;
