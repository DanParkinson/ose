import { useParams } from "react-router-dom";

import PageHeading from "../../components/structure/PageHeading";

const SubjectDashboardPage = () => {
  const { subjectId } = useParams();

  return (
    <PageHeading title={subjectId} />
  );
};

export default SubjectDashboardPage;
