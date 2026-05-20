import {
  Box,
  Grid,
  Center,
  Text,
} from "@chakra-ui/react";

import useCoreModelData from "../../hooks/useCoreModelData";

import LoadingSpinner from "../../components/feedback/LoadingSpinner";
import SubjectCard from "../../components/cards/SubjectCard";
import ThreeColumnLayout from "../../layouts/ThreeColumnLayout";
import SectionDividerHeading from "../../components/structure/SectionDividerHeading";

const SubjectListPageListSection = () => {
  const {
    rows,
    loading,

  } = useCoreModelData(
    "/core/subjects/",
    0,
    "",
    {
      is_published: true,
    }
  );

  const subjectsByLevel = rows.reduce((groups, subject) => {
    const level = subject.level || "Other";

    if (!groups[level]) {
      groups[level] = [];
    }

    groups[level].push(subject);

    return groups;
  }, {});

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <ThreeColumnLayout>
      {Object.entries(subjectsByLevel).map(([level, subjects]) => (
        <Box
          key={level}
          mb="10"
        >
          <SectionDividerHeading
            title={level}
          />

            <Grid
            templateColumns={{
                base: "1fr 1fr",
                md: "repeat(2, 1fr)",
                lg: "repeat(3, 1fr)",
            }}
            gap="3"
            maxW="800px"
            mx="auto"
            >
            {subjects.map((subject) => (
              <SubjectCard
                key={subject.subject_id}
                subject={subject}
              />
            ))}
          </Grid>
        </Box>
      ))}
    </ThreeColumnLayout>
  );
};

export default SubjectListPageListSection;
