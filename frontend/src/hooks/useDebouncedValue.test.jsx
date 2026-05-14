/**
 * useDebouncedValue Tests
 *
 * This test suite verifies:
 *
 * 1. Initial value is returned immediately
 * 2. Value updates after the debounce delay
 * 3. Value does not update before the delay finishes
 * 4. Previous debounce timers are cleared when value changes
 * 5. Custom delay values are supported
 * 6. Debounced value updates multiple times correctly
 */

import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";

import useDebouncedValue from "./useDebouncedValue";

describe("useDebouncedValue", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllMocks();
    vi.restoreAllMocks();
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  test("returns initial value immediately", () => {
    /**
     * Arrange:
     * Render the hook with an initial value.
     *
     * Act:
     * Read the returned hook value.
     *
     * Assert:
     * Confirm the initial value is returned immediately.
     */
    const { result } = renderHook(() =>
      useDebouncedValue("Mathematics")
    );

    expect(result.current).toBe("Mathematics");
  });

  test("updates value after debounce delay", () => {
    /**
     * Arrange:
     * Render the hook with an initial value.
     *
     * Act:
     * Rerender with a new value and advance timers past the debounce delay.
     *
     * Assert:
     * Confirm the debounced value updates after the delay.
     */
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: {
          value: "Math",
        },
      }
    );

    rerender({
      value: "Mathematics",
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("Mathematics");
  });

  test("does not update value before debounce delay finishes", () => {
    /**
     * Arrange:
     * Render the hook with an initial value.
     *
     * Act:
     * Rerender with a new value and advance timers partially.
     *
     * Assert:
     * Confirm the value has not updated before the delay completes.
     */
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: {
          value: "Math",
        },
      }
    );

    rerender({
      value: "Mathematics",
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current).toBe("Math");
  });

  test("clears previous debounce timer when value changes", () => {
    /**
     * Arrange:
     * Render the hook with an initial value.
     *
     * Act:
     * Rerender multiple times before the debounce delay completes.
     *
     * Assert:
     * Confirm only the latest value is applied.
     */
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: {
          value: "Math",
        },
      }
    );

    rerender({
      value: "English",
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    rerender({
      value: "Science",
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("Science");
  });

  test("supports custom delay values", () => {
    /**
     * Arrange:
     * Render the hook with a custom debounce delay.
     *
     * Act:
     * Rerender with a new value and advance timers using the custom delay.
     *
     * Assert:
     * Confirm the custom delay controls the update timing.
     */
    const { result, rerender } = renderHook(
      ({ value, delay }) =>
        useDebouncedValue(value, delay),
      {
        initialProps: {
          value: "Math",
          delay: 2000,
        },
      }
    );

    rerender({
      value: "Mathematics",
      delay: 2000,
    });

    act(() => {
      vi.advanceTimersByTime(1999);
    });

    expect(result.current).toBe("Math");

    act(() => {
      vi.advanceTimersByTime(1);
    });

    expect(result.current).toBe("Mathematics");
  });

  test("updates debounced value multiple times correctly", () => {
    /**
     * Arrange:
     * Render the hook with an initial value.
     *
     * Act:
     * Sequentially rerender with multiple values and complete each debounce cycle.
     *
     * Assert:
     * Confirm the debounced value updates correctly across multiple changes.
     */
    const { result, rerender } = renderHook(
      ({ value }) => useDebouncedValue(value),
      {
        initialProps: {
          value: "Math",
        },
      }
    );

    rerender({
      value: "English",
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("English");

    rerender({
      value: "Science",
    });

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(result.current).toBe("Science");
  });
});
