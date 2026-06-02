import { vi } from "vitest";

/**
 * Shared Mock Functions
 */

export const mockNavigate = vi.fn();

export const mockLogin = vi.fn();
export const mockRegister = vi.fn();
export const mockLogout = vi.fn();

export const clearAuthMocks = () => {
  vi.clearAllMocks();
};

export const mockParams = {};

/**
 * useAuth
 */

vi.mock("../../hooks/useAuth", () => ({
  default: vi.fn(),
}));

/**
 * React Router
 */

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");

  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => mockParams,
  };
});

/**
 * Chakra
 */

vi.mock("@chakra-ui/react", () => ({
  Box: ({ children }) => <div>{children}</div>,
  Text: ({ children }) => <p>{children}</p>,
  HStack: ({ children }) => <div>{children}</div>,
  VStack: ({ children }) => <div>{children}</div>,
}));

/**
 * Shared Form Components
 */

vi.mock(
  "../../components/forms/base/containers/FormContainer",
  () => ({
    default: ({ title, children }) => (
      <div>
        <h1>{title}</h1>
        {children}
      </div>
    ),
  })
);

vi.mock(
  "../../components/forms/base/form_field/FormFieldText",
  () => ({
    default: ({
      field,
      value,
      error,
      onChange,
    }) => (
      <>
        <input
          name={field.name}
          type={field.type}
          placeholder={field.placeholder}
          value={value}
          onChange={(event) =>
            onChange(field.name, event.target.value)
          }
        />

        {error && <p>{error}</p>}
      </>
    )
  })
);

vi.mock(
  "../../components/forms/base/form_field/FormFieldError",
  () => ({
    default: ({ children }) =>
      children ? <p>{children}</p> : null,
  })
);

vi.mock(
  "../../components/forms/base/feedback/FormError",
  () => ({
    default: ({ children }) =>
      children ? <p>{children}</p> : null,
  })
);

vi.mock(
  "../../components/forms/base/buttons/FormSubmitButton",
  () => ({
    default: ({
      children,
      onClick,
      disabled,
    }) => (
      <button
        onClick={onClick}
        disabled={disabled}
      >
        {children}
      </button>
    ),
  })
);

vi.mock(
  "../../components/forms/base/navigation/FormLink",
  () => ({
    default: ({
      text,
      to,
      linkText,
    }) => (
      <p>
        {text}
        <a href={to}>{linkText}</a>
      </p>
    ),
  })
);

vi.mock(
  "../../components/feedback/ButtonSpinner",
  () => ({
    default: () => <span>spinner</span>,
  })
);