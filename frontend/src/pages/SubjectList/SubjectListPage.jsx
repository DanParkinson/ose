import MainLayout from "../../layouts/MainLayout";
import SubjectListPageHeadingSection from "./SubjectListPageHeaadingSection";
import SubjectListPageListSection from "./SubjectListPageListSection";


const SubjectListPage = () => {
    return (
        <MainLayout>
            <SubjectListPageHeadingSection />
            <SubjectListPageListSection />
        </MainLayout>
    );
}

export default SubjectListPage;
