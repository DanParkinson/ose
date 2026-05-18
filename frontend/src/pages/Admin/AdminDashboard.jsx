import { useState } from "react";

// API & Data configs
import coreModels from "../../config/coreModels";
import useCoreModelData from "../../hooks/useCoreModelData";

// Layout
import DashboardLayout from "../../layouts/DashboardLayout";

// Dashboard Structure components
import DashboardSection from "../../components/structure/dashboard/DashboardSection";
import DashboardTable from "../../components/structure/dashboard/DashboardTable";
import DashboardTableTitleRow from "../../components/structure/dashboard/DashboardTableTitleRow";
import DashboardPanelBox from "../../components/structure/dashboard/DashboardPanelBox";
import DashboardFilterPanel from "../../components/structure/dashboard/DashboardFilterPanel";


// Forms
import CoreModelCreateForm from "../../components/forms/core/CoreModelCreateForm";

// Buttons
import CreateButton from "../../components/buttons/CreateButton";
import OpenFiltersButton from "../../components/buttons/OpenFilterButton";
import ResetFiltersButton from "../../components/buttons/ResetFiltersButton";

// Renderers
import ModelFieldRenderer from "../../components/renderers/ModelFieldRenderer";

// utils
import { buildResetFilters } from "../../utils/resetModelFilters";

// filters
import TextSearchFilter from "../../components/filters/TextSearchFilter";

// side panels
import SidePanel from "../../components/structure/SidePanel";

// Pagination
import Pagination from "../../components/pagination/Pagination";

const AdminDashboard = () => {
  const [selectedModel, setSelectedModel] = useState(coreModels[0]);
  const [createModel, setCreateModel] = useState(null);
  const [activeFilters, setActiveFilters] = useState({});
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [offset, setOffset] = useState(0);
  const [isCreatePanelOpen, setIsCreatePanelOpen] = useState(false);
  const [isFilterPanelOpen, setIsFilterPanelOpen] = useState(false);


  const limit = 20;

  const {
    rows, next, previous, count, loading, refetch,
  } = useCoreModelData(
    selectedModel.endpoint, offset, searchQuery, activeFilters
  );

  const handleModelChange = (row) => {
    setSelectedModel(row);
    setSearchInput("");
    setSearchQuery("");
    setOffset(0);

    const resetFilters = {};

    row.filters.forEach((filter) => {
      resetFilters[filter.key] = "all";
    });

    setActiveFilters(resetFilters);
  };

  const resetActiveFilters = () => {
    setActiveFilters(buildResetFilters(selectedModel.filters));
    setSearchInput("");
    setSearchQuery("");
    setOffset(0);
  };

  const openCreatePanel = (model) => {
    setSelectedModel(model);
    setCreateModel(model);
    setOffset(0);
    setIsCreatePanelOpen(true);
  };

  return (
    <>
      <DashboardLayout
        orchestrator={
          <DashboardSection>
            <DashboardTable
              columns={["Resource"]}
              rows={coreModels}
              templateColumns="1fr"
              getRowKey={(row) => row.id}
              isSelected={(row) => row.id === selectedModel.id}
              renderRow={(row) => (
                <DashboardTableTitleRow
                  title={row.title}
                  actions={
                    <CreateButton
                      onClick={(event) => {
                        event.stopPropagation();
                        openCreatePanel(row);
                      }}
                    />
                  }
                />
              )}
              onRowClick={handleModelChange}
            />
          </DashboardSection>
        }
        filters={
          <DashboardSection>
            <DashboardPanelBox title="Filters">
              <TextSearchFilter
                value={searchInput}
                onChange={setSearchInput}
                onSearch={(value) => {
                  setSearchQuery(value);
                  setOffset(0);
                }}
                placeholder={`Search ${selectedModel.title.toLowerCase()}...`}
              />

              <OpenFiltersButton
                onClick={() => setIsFilterPanelOpen(true)}
              />

              <ResetFiltersButton
                onClick={resetActiveFilters}
              />
            </DashboardPanelBox>
          </DashboardSection>
        }
        main={
          <DashboardSection>
            <DashboardTable
              columns={selectedModel.columns}
              rows={rows}
              loading={loading}
              templateColumns={selectedModel.templateColumns}
              getRowKey={(row) => row[selectedModel.keyField]}
              renderRow={(row) =>
                selectedModel.fields.map((field) => (
                  <ModelFieldRenderer
                    key={`${row[selectedModel.keyField]}-${field}`}
                    value={row[field]}
                  />
                ))
              }
            />
          </DashboardSection>
        }
        pagination={
          <DashboardSection>
            <DashboardPanelBox title="Pagination">
              <Pagination
                previous={previous}
                next={next}
                offset={offset}
                limit={limit}
                count={count}
                onPrevious={() => {
                  if (!previous || offset === 0) return;

                  setOffset((prev) =>
                    Math.max(prev - limit, 0)
                  );
                }}
                onNext={() => {
                  if (!next) return;

                  setOffset((prev) => prev + limit);
                }}
              />
            </DashboardPanelBox>
          </DashboardSection>
        }
      />

      <SidePanel
        isOpen={isCreatePanelOpen}
        onClose={() => setIsCreatePanelOpen(false)}
        title={`Create ${createModel?.title || ""}`}
      >
        {createModel && (
          <CoreModelCreateForm
            key={createModel.id}
            model={createModel}
            onCreated={() => {
              setIsCreatePanelOpen(false);
              setSelectedModel(createModel);
              setOffset(0);
              refetch();
            }}
          />
        )}
      </SidePanel>

      <SidePanel
        isOpen={isFilterPanelOpen}
        onClose={() => setIsFilterPanelOpen(false)}
        title={`Filter ${selectedModel.title}`}
      >
        <DashboardFilterPanel
          filters={selectedModel.filters}
          activeFilters={activeFilters}
          onFilterChange={(filterKey, value) => {
            setActiveFilters((prev) => ({
              ...prev,
              [filterKey]: value,
            }));
            setOffset(0);
          }}
        />
      </SidePanel>
    </>
  );
};

export default AdminDashboard;
