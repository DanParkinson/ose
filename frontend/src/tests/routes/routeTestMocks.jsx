import { vi } from "vitest";

export const mockUseAuth = vi.fn();

vi.mock("../../hooks/useAuth", () => ({
  default: () => mockUseAuth(),
}));

vi.mock("react-router-dom", () => ({
  Navigate: ({ to }) => <div>Redirect: {to}</div>,
}));

vi.mock("../../components/feedback/PageLoadingSpinner", () => ({
  default: ({ label }) => <div>{label}</div>,
}));

export const clearRouteMocks = () => {
  vi.clearAllMocks();
};
