import { Box, Heading, Text, Stack } from "@chakra-ui/react";
import ThreeColumnLayout from "../../layouts/ThreeColumnLayout";
// import Advertisement from "../../components/advertisements/Advertisement";
import SectionDividerHeading from "../../components/structure/SectionDividerHeading";

const AboutSection = ({ title, children }) => {
  return (
    <Box>
      <SectionDividerHeading title={title}/>
      <Stack gap={3} color="text.light4" fontSize={{ base: "sm", md: "md" }} lineHeight="1.8" >
        {children}
      </Stack>
    </Box>
  );
};

const AboutPageHeroSection = () => {
  return (
    <Box as="main" bg="bg.canvas">
      <ThreeColumnLayout >
        <Stack align="center" >
          <Box w="58px" h="1px" bg="text.dark" />

          <Stack gap={2} color="text.accent">
            <AboutSection title="Who We Are">
              <Text>
                At Open-Source Education, we want to save teachers time and schools
                money by bringing together the teaching community through shared,
                high-quality educational resources and collaborative systems.
              </Text>

              <Text>
                Educators spend countless hours producing resources, adapting
                materials or searching for content that already exists elsewhere.
                Too often, teachers are solving the same problems in isolation when
                that time could be better spent teaching, supporting students and
                making a meaningful impact in the classroom.
              </Text>

              <Text>
                We believe teaching should be more collaborative. Schools and
                teachers already hold an enormous amount of knowledge, experience
                and creativity, but much of that work remains disconnected,
                duplicated or locked behind expensive systems and subscriptions.
              </Text>

              <Text>
                Our goal is to create a community-driven platform that supports
                teachers at every stage of their careers while helping schools
                reduce unnecessary workload and costs.
              </Text>
            </AboutSection>
          </Stack>
        </Stack>
      </ThreeColumnLayout>

      <ThreeColumnLayout >
        <AboutSection title="Open-Source Principles">
          <Text>
            Open source is an idea that comes from programming. Developers often need to solve the
            same problems, so communities create free tools and frameworks that anyone can use.
          </Text>

          <Text>
            Instead of working in isolation, people contribute small improvements that build into
            something powerful over time. This collaborative approach allows knowledge, ideas and
            solutions to be shared openly rather than locked behind paywalls or duplicated endlessly.
          </Text>

          <Text>
            By sharing the work, we can reduce workload, improve quality and support more teachers.
            A shared pool of resources means better consistency, more ideas, and more time for
            what actually matters — teaching, supporting students, and making an impact.
          </Text>

          <Text>
            Open-source education is not just about free resources. It is about collaboration,
            trust, and building something collectively that is stronger than anything created alone.
          </Text>
        </AboutSection>
      </ThreeColumnLayout>

      <ThreeColumnLayout >
        <AboutSection title="Our Goals">
          <Text>
            By working together, we can build something all teachers can be proud of and use.
            A shared system allows us to move away from isolated effort and towards a more
            connected, supportive way of working.
          </Text>

          <Text>
            We want to create lessons, resources, templates and systems that support different
            teaching styles, giving educators the flexibility to adapt materials to their own
            classrooms rather than being restricted by rigid, one-size-fits-all solutions.
          </Text>

          <Text>
            A key focus is reducing unnecessary workload. Teachers should not have to spend
            hours recreating materials that already exist. By building a shared foundation,
            we can free up time for planning, delivery and meaningful interaction with students.
          </Text>

          <Text>
            We also aim to reduce unnecessary costs for schools. Too often, budgets are spent
            on resources that replicate work already being done within classrooms. By providing
            high-quality, openly shared materials, schools can redirect funding to areas that
            have a greater impact on student outcomes.
          </Text>
        </AboutSection>
      </ThreeColumnLayout>

      <ThreeColumnLayout >
        <AboutSection title="The Plan">
          <Text>
            Our plan is to build free-to-use lessons, booklets, units and curriculums that are
            practical, adaptable and easy to use, with a clear focus on real classroom application.
          </Text>

          <Text>
            We will start by developing core resources that teachers can use immediately,
            while still allowing flexibility to adapt content to different classes and teaching styles.
          </Text>

          <Text>
            Supporting early career teachers is a key priority. By providing clear lesson
            breakdowns, common misconceptions and practical guidance, we aim to reduce the
            challenges faced at the start of their careers.
          </Text>

          <Text>
            Longer term, we aim to improve areas such as cover work and provide more reliable,
            ready-to-use materials, while offering cheaper alternatives for schools.
          </Text>

          <Text>
            Any value created will be reinvested back into the platform to continuously
            improve resources and better support teachers.
          </Text>
        </AboutSection>
      </ThreeColumnLayout>
    </Box>
  );
};

export default AboutPageHeroSection;
