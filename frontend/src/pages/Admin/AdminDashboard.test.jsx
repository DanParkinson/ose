/**
 * AdminDashboard Tests
 *
 * This test suite verifies:
 *
 * 1. The dashboard renders the main layout areas
 * 2. Core model navigation renders from config
 * 3. Selecting a model resets search, offset, and filters
 * 4. Search updates the search query and resets pagination offset
 * 5. Reset filters clears search and resets filters
 * 6. Pagination next and previous handlers update offset correctly
 * 7. Create panel opens for the selected model
 * 8. Successful creation closes the panel and refetches data
 * 9. Filter panel opens and updates active filters
 *
 * Child components are mocked so these tests focus only on
 * AdminDashboard state and orchestration behaviour.
 */

import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  render,
  screen,
  fireEvent,
  cleanup,
} from "@testing-library/react";
import "@testing-library/jest-dom/vitest";

import AdminDashboard from "./AdminDashboard";

const {
  mockCoreModels,
  mockRefetch,
} = vi.hoisted(() => ({
  mockRefetch: vi.fn(),

  mockCoreModels: [
    {
      id: "subjects",
      title: "Subjects",
      endpoint: "/core/subjects/",
      columns: ["Title", "Level"],
      templateColumns: "1fr 1fr",
      keyField: "subject_id",
      fields: ["title", "level"],
      filters: [
        {
          key: "level",
          title: "Level",
          options: [
            { label: "All", value: "all" },
            { label: "Primary", value: "primary" },
            { label: "Secondary", value: "secondary" },
          ],
        },
      ],
    },
    {
      id: "topics",
      title: "Topics",
      endpoint: "/core/topics/",
      columns: ["Title", "Protected"],
      templateColumns: "1fr 1fr",
      keyField: "topic_id",
      fields: ["title", "is_protected"],
      filters: [
        {
          key: "is_protected",
          title: "Protected",
          options: [
            { label: "All", value: "all" },
            { label: "Yes", value: true },
            { label: "No", value: false },
          ],
        },
      ],
    },
  ],
}));

const mockRows = [
  {
    subject_id: "subject-1",
    title: "Mathematics",
    level: "secondary",
  },
];

let mockUseCoreModelDataResult;

vi.mock("../../config/coreModels", () => ({
  default: mockCoreModels,
}));

vi.mock("../../hooks/useCoreModelData", () => ({
  default: vi.fn((endpoint, offset, searchQuery, activeFilters) => {
    mockUseCoreModelDataResult.lastCall = {
      endpoint,
      offset,
      searchQuery,
      activeFilters,
    };

    return mockUseCoreModelDataResult;
  }),
}));

vi.mock("@chakra-ui/react", () => ({
  Text: ({ children }) => <p>{children}</p>,
  HStack: ({ children }) => <div>{children}</div>,
  Button: ({ children, onClick }) => (
    <button onClick={onClick}>{children}</button>
  ),
}));

vi.mock("../../layouts/DashboardLayout", () => ({
  default: ({
    orchestrator,
    filters,
    main,
    pagination,
  }) => (
    <div>
      <section data-testid="orchestrator-area">{orchestrator}</section>
      <section data-testid="filters-area">{filters}</section>
      <section data-testid="main-area">{main}</section>
      <section data-testid="pagination-area">{pagination}</section>
    </div>
  ),
}));

vi.mock("../../components/structure/dashboard/DashboardSection", () => ({
  default: ({ children }) => <div>{children}</div>,
}));

vi.mock("../../components/structure/dashboard/DashboardPanelBox", () => ({
  default: ({ title, children }) => (
    <div>
      <h2>{title}</h2>
      {children}
    </div>
  ),
}));

vi.mock("../../components/structure/dashboard/DashboardTable", () => ({
  default: ({
    columns,
    rows,
    getRowKey,
    renderRow,
    onRowClick,
    isSelected,
  }) => (
    <div>
      <p>Columns: {columns.join(", ")}</p>

      {rows.map((row, index) => {
        const rowKey = getRowKey?.(row) ?? index;
        const selected = isSelected?.(row);

        return (
          <button
            key={rowKey}
            type="button"
            data-testid={`table-row-${rowKey}`}
            data-selected={String(selected)}
            onClick={() => onRowClick?.(row)}
          >
            {renderRow(row)}
          </button>
        );
      })}
    </div>
  ),
}));

vi.mock("../../components/structure/dashboard/DashboardTableTitleRow", () => ({
  default: ({ title, actions }) => (
    <div>
      <span>{title}</span>
      {actions}
    </div>
  ),
}));

vi.mock("../../components/structure/dashboard/DashboardFilterPanel", () => ({
  default: ({
    filters,
    activeFilters,
    onFilterChange,
  }) => (
    <div>
      <p>Dashboard Filter Panel</p>
      <p>Active filters: {JSON.stringify(activeFilters)}</p>

      {filters.map((filter) => (
        <button
          key={filter.key}
          type="button"
          onClick={() =>
            onFilterChange(
              filter.key,
              filter.options[1].value
            )
          }
        >
          Set {filter.key}
        </button>
      ))}
    </div>
  ),
}));

vi.mock("../../components/structure/dashboard/DashboardTableHeader", () => ({
  default: () => <div>Dashboard Table Header</div>,
}));

vi.mock("../../components/forms/core/CoreModelCreateForm", () => ({
  default: ({ model, onCreated }) => (
    <div>
      <p>Create form for {model.title}</p>

      <button
        type="button"
        onClick={onCreated}
      >
        Finish Create
      </button>
    </div>
  ),
}));

vi.mock("../../components/buttons/CreateButton", () => ({
  default: ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
    >
      Create
    </button>
  ),
}));

vi.mock("../../components/buttons/OpenFilterButton", () => ({
  default: ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
    >
      Open Filters
    </button>
  ),
}));

vi.mock("../../components/buttons/ResetFiltersButton", () => ({
  default: ({ onClick }) => (
    <button
      type="button"
      onClick={onClick}
    >
      Reset Filters
    </button>
  ),
}));

vi.mock("../../components/renderers/ModelFieldRenderer", () => ({
  default: ({ value }) => (
    <span>{String(value)}</span>
  ),
}));

vi.mock("../../components/utils/resetModelFilters", () => ({
  buildResetFilters: vi.fn((filters) =>
    filters.reduce((acc, filter) => {
      acc[filter.key] = "all";
      return acc;
    }, {})
  ),
}));

vi.mock("../../components/filters/TextSearchFilter", () => ({
  default: ({
    value,
    onChange,
    onSearch,
    placeholder,
  }) => (
    <div>
      <input
        placeholder={placeholder}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />

      <button
        type="button"
        onClick={() => onSearch("algebra")}
      >
        Search Algebra
      </button>
    </div>
  ),
}));

vi.mock("../../components/structure/SidePanel", () => ({
  default: ({
    isOpen,
    title,
    children,
    onClose,
  }) => (
    <div data-testid={`side-panel-${title}`}>
      <p>{title}</p>
      <p>Open: {String(isOpen)}</p>

      {isOpen && (
        <>
          <button
            type="button"
            onClick={onClose}
          >
            Close {title}
          </button>

          {children}
        </>
      )}
    </div>
  ),
}));

vi.mock("../../components/pagination/Pagination", () => ({
  default: ({
    previous,
    next,
    offset,
    limit,
    count,
    onPrevious,
    onNext,
  }) => (
    <div>
      <p>
        Pagination: offset {offset}, limit {limit}, count {count}
      </p>

      <button
        type="button"
        disabled={!previous || offset === 0}
        onClick={onPrevious}
      >
        Previous Page
      </button>

      <button
        type="button"
        disabled={!next}
        onClick={onNext}
      >
        Next Page
      </button>
    </div>
  ),
}));

describe("AdminDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockUseCoreModelDataResult = {
      rows: mockRows,
      next: "/core/subjects/?offset=20",
      previous: null,
      count: 40,
      refetch: mockRefetch,
      lastCall: null,
    };
  });

  afterEach(() => {
    cleanup();
  });

  test("renders dashboard layout areas", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Query the mocked layout areas.
     *
     * Assert:
     * Confirm orchestrator, filters, main,
     * and pagination sections are rendered.
     */

    render(<AdminDashboard />);

    expect(
      screen.getByTestId("orchestrator-area")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("filters-area")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("main-area")
    ).toBeInTheDocument();

    expect(
      screen.getByTestId("pagination-area")
    ).toBeInTheDocument();
  });

  test("renders core model navigation rows", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Query the model titles.
     *
     * Assert:
     * Confirm configured core models render.
     */

    render(<AdminDashboard />);

    expect(
      screen.getByText("Subjects")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Topics")
    ).toBeInTheDocument();
  });

  test("fetches data for the initially selected model", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Read the mocked hook arguments.
     *
     * Assert:
     * Confirm initial state is passed into the hook.
     */

    render(<AdminDashboard />);

    expect(
      mockUseCoreModelDataResult.lastCall
    ).toEqual({
      endpoint: "/core/subjects/",
      offset: 0,
      searchQuery: "",
      activeFilters: {},
    });
  });

  test("changes selected model and resets filters when model row is clicked", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Click the Topics model row.
     *
     * Assert:
     * Confirm model endpoint and filters update.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getByTestId("table-row-topics")
    );

    expect(
      mockUseCoreModelDataResult.lastCall
    ).toEqual({
      endpoint: "/core/topics/",
      offset: 0,
      searchQuery: "",
      activeFilters: {
        is_protected: "all",
      },
    });
  });

  test("updates search query and resets offset when searching", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Trigger a search action.
     *
     * Assert:
     * Confirm search query updates and offset resets.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getByText("Search Algebra")
    );

    expect(
      mockUseCoreModelDataResult.lastCall.searchQuery
    ).toBe("algebra");

    expect(
      mockUseCoreModelDataResult.lastCall.offset
    ).toBe(0);
  });

  test("resets active filters and search when reset filters is clicked", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     * Apply a filter first.
     *
     * Act:
     * Click reset filters.
     *
     * Assert:
     * Confirm filters and search reset.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getByText("Open Filters")
    );

    fireEvent.click(
      screen.getByText("Set level")
    );

    expect(
      mockUseCoreModelDataResult.lastCall.activeFilters
    ).toEqual({
      level: "primary",
    });

    fireEvent.click(
      screen.getByText("Reset Filters")
    );

    expect(
      mockUseCoreModelDataResult.lastCall
    ).toEqual({
      endpoint: "/core/subjects/",
      offset: 0,
      searchQuery: "",
      activeFilters: {
        level: "all",
      },
    });
  });

  test("moves to next page when next button is clicked", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Click next page.
     *
     * Assert:
     * Confirm offset increases by limit.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getByText("Next Page")
    );

    expect(
      mockUseCoreModelDataResult.lastCall.offset
    ).toBe(20);
  });

  test("does not move to previous page when previous page is unavailable", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Click previous page.
     *
     * Assert:
     * Confirm offset remains unchanged.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getByText("Previous Page")
    );

    expect(
      mockUseCoreModelDataResult.lastCall.offset
    ).toBe(0);
  });

  test("opens create panel for selected model", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Click create button.
     *
     * Assert:
     * Confirm create side panel opens.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getAllByText("Create")[0]
    );

    expect(
      screen.getByText("Create Subjects")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Open: true")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Create form for Subjects")
    ).toBeInTheDocument();
  });

  test("successful creation closes panel and refetches data", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     * Open create panel.
     *
     * Act:
     * Complete mocked creation.
     *
     * Assert:
     * Confirm refetch runs and panel closes.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getAllByText("Create")[0]
    );

    fireEvent.click(
      screen.getByText("Finish Create")
    );

    expect(mockRefetch).toHaveBeenCalledTimes(1);

    expect(
      screen.queryByText("Create form for Subjects")
    ).not.toBeInTheDocument();
  });

  test("opens filter panel and updates active filters", () => {
    /**
     * Arrange:
     * Render the AdminDashboard component.
     *
     * Act:
     * Open filter panel and apply filter.
     *
     * Assert:
     * Confirm active filters update correctly.
     */

    render(<AdminDashboard />);

    fireEvent.click(
      screen.getByText("Open Filters")
    );

    expect(
      screen.getByText("Dashboard Filter Panel")
    ).toBeInTheDocument();

    fireEvent.click(
      screen.getByText("Set level")
    );

    expect(
      mockUseCoreModelDataResult.lastCall
    ).toEqual({
      endpoint: "/core/subjects/",
      offset: 0,
      searchQuery: "",
      activeFilters: {
        level: "primary",
      },
    });
  });
});
