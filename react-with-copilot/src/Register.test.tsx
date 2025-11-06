// src/Register.test.tsx
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Register from "./Register";

describe("Register", () => {
  beforeEach(() => {
    render(<Register />);
  });

  it("renders form fields and submit button", () => {
    expect(screen.getByLabelText("Username")).toBeInTheDocument();
    expect(screen.getByLabelText("UK Mobile Number")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Submit" })).toBeInTheDocument();
  });

  it("shows error for invalid username and clears for valid username", () => {
    const usernameInput = screen.getByLabelText("Username");
    fireEvent.change(usernameInput, { target: { value: "short" } });
    expect(screen.queryByText(/Invalid username/i)).toBeInTheDocument();

    fireEvent.change(usernameInput, { target: { value: "Valid#123" } });
    expect(screen.queryByText(/Invalid username/i)).not.toBeInTheDocument();
  });

  it("shows error for invalid UK mobile and clears for valid mobile", () => {
    const mobileInput = screen.getByLabelText("UK Mobile Number");
    fireEvent.change(mobileInput, { target: { value: "1234567890" } });
    expect(
      screen.queryByText(/Invalid UK mobile number format/i)
    ).toBeInTheDocument();

    fireEvent.change(mobileInput, { target: { value: "07123456789" } });
    expect(
      screen.queryByText(/Invalid UK mobile number format/i)
    ).not.toBeInTheDocument();
  });

  it("submits form with valid data and no errors", () => {
    const usernameInput = screen.getByLabelText("Username");
    const mobileInput = screen.getByLabelText("UK Mobile Number");
    const submitButton = screen.getByRole("button", { name: "Submit" });

    fireEvent.change(usernameInput, { target: { value: "Valid#123" } });
    fireEvent.change(mobileInput, { target: { value: "07123456789" } });

    const logSpy = vi.spyOn(console, "log").mockImplementation(() => {});

    fireEvent.click(submitButton);

    expect(screen.queryByText(/Invalid username/i)).not.toBeInTheDocument();
    expect(
      screen.queryByText(/Invalid UK mobile number format/i)
    ).not.toBeInTheDocument();
    expect(logSpy).toHaveBeenCalledWith({
      username: "Valid#123",
      ukMobile: "07123456789",
    });

    logSpy.mockRestore();
  });
});
