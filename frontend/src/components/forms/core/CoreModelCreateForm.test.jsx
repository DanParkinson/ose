/**
 * CoreModelCreateForm Tests
 *
 * This test suite verifies:
 *
 * 1. Form fields render correctly
 * 2. Form values update when users type
 * 3. Successful form submission calls createCoreModelItem
 * 4. Success messages render after successful creation
 */

import {
  render,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";

import "@testing-library/jest-dom/vitest";

import {
  describe,
  test,
  expect,
  vi,
  beforeEach,
} from "vitest";

import CoreModelCreateForm from "./CoreModelCreateForm";

import { createCoreModelItem } from "../../../api/coreApi";

vi.mock("../../../api/coreApi", () => ({
  createCoreModelItem: vi.fn(),
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
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
    >
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
        onChange={(event) =>
          onChange(field.name, event.target.value)
        }
      />
    </label>
  ),
}));

vi.mock("../base/FormError", () => ({
  default: ({ children }) =>
    children ? <p>{children}</p> : null,
}));

vi.mock("../base/FormSuccess", () => ({
  default: ({ children }) =>
    children ? <p>{children}</p> : null,
}));

vi.mock("../../feedback/ButtonSpinner", () => ({
  default: () => <span>Loading...</span>,
}));

describe("CoreModelCreateForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("submits form data successfully", async () => {
    createCoreModelItem.mockResolvedValue({
      subject_id: "1",
      title: "Mathematics",
    });

    const model = {
      title: "Subject",
      endpoint: "/core/subjects/",
      createFields: [
        {
          name: "title",
          label: "Title",
          type: "text",
        },
      ],
    };

    render(<CoreModelCreateForm model={model} />);

    const titleInput = screen.getByLabelText(/title/i);

    fireEvent.change(titleInput, {
      target: { value: "Mathematics" },
    });

    const submitButton = screen.getByRole("button", {
      name: /create/i,
    });

    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(createCoreModelItem).toHaveBeenCalledWith({
        endpoint: "/core/subjects/",
        data: {
          title: "Mathematics",
        },
      });
    });

    expect(
      await screen.findByText(
        /subject created successfully/i
      )
    ).toBeInTheDocument();
  });
});
