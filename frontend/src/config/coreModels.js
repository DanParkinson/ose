const coreModels = [
  {
    id: "subjects",
    title: "Subjects",
    endpoint: "/core/subjects/",
    detailEndpoint: "/core/subjects/",
    columns: ["Subject", "Level","Published", "Protected"],
    templateColumns: "2fr 1fr 1fr 1fr",
    keyField: "subject_id",
    fields: ["title", "level", "is_published", "is_protected"],
    filters: [
      {
        key: "level",
        title: "By level",
        options: [
          { label: "All", value: "all" },
          { label: "Primary", value: "primary" },
          { label: "Secondary", value: "secondary" },
        ],
      },
      {
        key: "language",
        title: "By language",
        options: [
          { label: "All", value: "all" },
          { label: "English", value: "en" },
        ],
      },
      {
        key: "is_published",
        title: "By published",
        options: [
          { label: "All", value: "all" },
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
      {
        key: "is_protected",
        title: "By protected",
        options: [
          { label: "All", value: "all" },
          { label: "Yes", value: true },
          { label: "No", value: false },
        ],
      },
    ],
    createFields: [
      { name: "title", label: "Title", type: "text" },
      { name: "level", label: "Level", type: "choice" },
      { name: "language", label: "Language", type: "choice" },
      { name: "is_published", label: "Published", type: "boolean" },
      { name: "is_protected", label: "Protected", type: "boolean" },
    ],
    updateFields: [
      { name: "title", label: "Title", type: "text" },
      { name: "level", label: "Level", type: "choice" },
      { name: "language", label: "Language", type: "choice" },
      { name: "is_published", label: "Published", type: "boolean" },
      { name: "is_protected", label: "Protected", type: "boolean" },
    ],
  },
];

export default coreModels;
