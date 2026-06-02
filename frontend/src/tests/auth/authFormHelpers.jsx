import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";

/**
 * Render
 */

export const renderForm = (Component) => {
  render(<Component />);
};

/**
 * Inputs
 */

export const typeEmail = (
  value = "test@example.com"
) => {
  fireEvent.change(
    screen.getByPlaceholderText(
      "me@example.com"
    ),
    {
      target: { value },
    }
  );
};

export const typePassword = (
  value = "password123"
) => {
  const inputs =
    screen.getAllByPlaceholderText(
      "********"
    );

  fireEvent.change(inputs[0], {
    target: { value },
  });
};

export const typeConfirmPassword = (
  value = "password123"
) => {
  const inputs =
    screen.getAllByPlaceholderText(
      "********"
    );

  fireEvent.change(inputs[1], {
    target: { value },
  });
};

/**
 * Submit
 */

export const submitForm = (
  buttonName
) => {
  fireEvent.click(
    screen.getByRole("button", {
      name: buttonName,
    })
  );
};

/**
 * Common Auth Flows
 */

export const completeRegisterForm =
  ({
    email = "test@example.com",
    password = "password123",
    confirmPassword = "password123",
  } = {}) => {
    typeEmail(email);
    typePassword(password);
    typeConfirmPassword(
      confirmPassword
    );
  };

export const completeLoginForm =
  ({
    email = "test@example.com",
    password = "password123",
  } = {}) => {
    fireEvent.change(
      screen.getByPlaceholderText(
        "me@example.com"
      ),
      {
        target: { value: email },
      }
    );

    fireEvent.change(
      screen.getByPlaceholderText(
        "********"
      ),
      {
        target: { value: password },
      }
    );
  };