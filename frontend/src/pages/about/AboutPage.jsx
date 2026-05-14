import MainLayout from "../../layouts/MainLayout";
import AboutUsHeadingSection from "./AboutPageHeadingSection";
import AboutPageHeroSection from "./AboutPageHeroSection";



const AboutPage = () => {
    return (
        <MainLayout>
            <AboutUsHeadingSection />
            <AboutPageHeroSection/>
        </MainLayout>
    )
};

export default AboutPage;
