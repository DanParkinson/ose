/**
 * CoreModelUpdateDeleteForm Tests
 *
 * This test suite verifies:
 *
 * 1. Existing row data loads into form fields
 * 2. Form values update when users type
 * 3. Successful update submissions call updateCoreModelItem
 * 4. Successful delete submissions call deleteCoreModelItem
 * 5. Success messages render after successful update
 * 6. Success messages render after successful delete
 * 7. Delete button is disabled until delete confirmation is enabled
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
  cleanup,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

import CoreModelUpdateDeleteForm from "./CoreModelUpdateDeleteForm";

import {
  updateCoreModelItem,
  deleteCoreModelItem,
} from "../../../api/coreApi";

vi.mock("../../../api/coreApi", () => ({
  updateCoreModelItem: vi.fn(),
  deleteCoreModelItem: vi.fn(),
}));

vi.mock("@chakra-ui/react", () => ({
  VStack: ({ children }) => <div>{children}</div>,
  HStack: ({ children }) => <div>{children}</div>,
  Button: ({
    children,
    onClick,
    type = "button",
    disabled,
  }) => (
    <button type={type} onClick={onClick} disabled={disabled}>
      {children}
    </button>
  ),
  Spinner: () => <span>Loading...</span>,
}));

vi.mock("../../../hooks/useCoreFieldOptions", () => ({
  default: () => ({}),
}));

vi.mock("../../../hooks/useCoreRelationOptions", () => ({
  default: () => ({}),
}));

vi.mock("../../../hooks/useDebouncedValue", () => ({
  default: (value) => value,
}));

vi.mock("../../renderers/FormFieldRenderer", () => ({
  default: ({ field, formData, onChange }) => (
    <label>
      {field.label}
      <input
        value={formData[field.name]}
        onChange={(event) => onChange(field.name, event.target.value)}
      />
    </label>
  ),
}));

vi.mock("../base/FormError", () => ({
  default: ({ children }) => (children ? <p>{children}</p> : null),
}));

vi.mock("../base/FormSuccess", () => ({
  default: ({ children }) => (children ? <p>{children}</p> : null),
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
  default: () => <span>Loading...</span>,
}));

vi.mock("../../ui/AppSwitch", () => ({
  default: ({ checked, onCheckedChange, children }) => (
    <label>
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) =>
          onCheckedChange({
            checked: event.target.checked,
          })
        }
      />
      {children}
    </label>
  ),
}));

describe("CoreModelUpdateDeleteForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    cleanup();
  });

  const model = {
    title: "Subject",
    endpoint: "/core/subjects/",
    detailEndpoint: "/core/subjects/",
    keyField: "subject_id",
    createFields: [
      {
        name: "title",
        label: "Title",
        type: "text",
      },
    ],
  };

  const row = {
    subject_id: "subject-1",
    title: "Mathematics",
  };

  test("loads existing row data into form fields", () => {
    render(<CoreModelUpdateDeleteForm model={model} row={row} />);

    expect(screen.getByDisplayValue("Mathematics")).toBeInTheDocument();
  });

  test("submits updated form data successfully", async () => {
    updateCoreModelItem.mockResolvedValue({
      subject_id: "subject-1",
      title: "Updated Mathematics",
    });

    render(<CoreModelUpdateDeleteForm model={model} row={row} />);

    const titleInput = screen.getByLabelText(/title/i);

    fireEvent.change(titleInput, {
      target: { value: "Updated Mathematics" },
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /update/i,
      })
    );

    await waitFor(() => {
      expect(updateCoreModelItem).toHaveBeenCalledWith({
        detailEndpoint: "/core/subjects/",
        id: "subject-1",
        data: {
          title: "Updated Mathematics",
        },
      });
    });

    expect(
      await screen.findByText(/subject updated successfully/i)
    ).toBeInTheDocument();
  });

  test("delete button is disabled until delete confirmation is enabled", () => {
    render(<CoreModelUpdateDeleteForm model={model} row={row} />);

    expect(
      screen.getByRole("button", {
        name: /delete/i,
      })
    ).toBeDisabled();
  });

  test("submits delete successfully when delete confirmation is enabled", async () => {
    deleteCoreModelItem.mockResolvedValue({});

    render(<CoreModelUpdateDeleteForm model={model} row={row} />);

    fireEvent.click(screen.getByRole("checkbox"));

    fireEvent.click(
      screen.getByRole("button", {
        name: /delete/i,
      })
    );

    await waitFor(() => {
      expect(deleteCoreModelItem).toHaveBeenCalledWith({
        detailEndpoint: "/core/subjects/",
        id: "subject-1",
      });
    });

    expect(
      await screen.findByText(/subject deleted successfully/i)
    ).toBeInTheDocument();
  });
});
