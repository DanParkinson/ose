/**
 * TextSearchFilter Tests
 *
 * This test suite verifies:
 *
 * 1. The input renders correctly
 * 2. Custom placeholder text renders correctly
 * 3. onChange is called with the correct value
 * 4. onSearch is triggered after the debounce delay
 * 5. Existing timers are cleared before creating new ones
 *
 * Notes:
 * - Chakra components are mocked to avoid ChakraProvider requirements
 * - Fake timers are used to test debounce behaviour
 * - Tests focus on behaviour rather than styling
 */

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";

import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";

import TextSearchFilter from "./TextSearchFilter";

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => (
    <div>{children}</div>
  ),

  Input: ({
    value,
    onChange,
    placeholder,
  }) => (
    <input
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  ),
}));

describe("TextSearchFilter", () => {
  beforeEach(() => {
    cleanup();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  test("renders the input field", () => {
    /**
     * Arrange:
     * Render the component with default props.
     *
     * Act:
     * Query the input element.
     *
     * Assert:
     * Confirm the input renders successfully.
     */
    render(
      <TextSearchFilter
        value=""
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Search..."
      )
    ).toBeTruthy();
  });

  test("renders a custom placeholder", () => {
    /**
     * Arrange:
     * Render the component with a custom placeholder.
     *
     * Act:
     * Query the custom placeholder text.
     *
     * Assert:
     * Confirm the custom placeholder renders correctly.
     */
    render(
      <TextSearchFilter
        value=""
        onChange={vi.fn()}
        onSearch={vi.fn()}
        placeholder="Search subjects..."
      />
    );

    expect(
      screen.getByPlaceholderText(
        "Search subjects..."
      )
    ).toBeTruthy();
  });

  test("calls onChange with the correct input value", () => {
    /**
     * Arrange:
     * Render the component with a mocked onChange handler.
     *
     * Act:
     * Type into the input field.
     *
     * Assert:
     * Confirm onChange receives the typed value.
     */
    const mockOnChange = vi.fn();

    render(
      <TextSearchFilter
        value=""
        onChange={mockOnChange}
        onSearch={vi.fn()}
      />
    );

    const input =
      screen.getByPlaceholderText(
        "Search..."
      );

    fireEvent.change(input, {
      target: {
        value: "mathematics",
      },
    });

    expect(mockOnChange).toHaveBeenCalledWith(
      "mathematics"
    );
  });

  test("calls onSearch after the debounce delay", () => {
    /**
     * Arrange:
     * Render the component with a mocked onSearch handler.
     *
     * Act:
     * Advance fake timers past the debounce delay.
     *
     * Assert:
     * Confirm onSearch is called with the current value.
     */
    const mockOnSearch = vi.fn();

    render(
      <TextSearchFilter
        value="mathematics"
        onChange={vi.fn()}
        onSearch={mockOnSearch}
        delay={500}
      />
    );

    vi.advanceTimersByTime(500);

    expect(mockOnSearch).toHaveBeenCalledWith(
      "mathematics"
    );
  });

  test("clears previous timeout before creating a new one", () => {
    /**
     * Arrange:
     * Spy on clearTimeout.
     * Render the component and rerender with a new value.
     *
     * Act:
     * Trigger the effect cleanup by rerendering.
     *
     * Assert:
     * Confirm clearTimeout is called to prevent stale searches.
     */
    const clearTimeoutSpy = vi.spyOn(
      globalThis,
      "clearTimeout"
    );

    const { rerender } = render(
      <TextSearchFilter
        value="math"
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    rerender(
      <TextSearchFilter
        value="english"
        onChange={vi.fn()}
        onSearch={vi.fn()}
      />
    );

    expect(clearTimeoutSpy).toHaveBeenCalled();
  });
});
