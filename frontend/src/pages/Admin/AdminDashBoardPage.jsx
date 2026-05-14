import MainLayout from "../../layouts/MainLayout";
import AdminDashboard from "./AdminDashboard";
import AdminDashboardHeadingSection from "./AdminDashboardHeadingSection";



const AdminDashboardPage = () => {
    return (
        <MainLayout>
            <AdminDashboardHeadingSection />
            <AdminDashboard />
        </MainLayout>
    );
}

export default AdminDashboardPage;
