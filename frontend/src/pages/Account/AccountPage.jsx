import { useState } from "react";

// hooks
import useAuth from "../../hooks/useAuth";

// structure
import PageHeading from "../../components/structure/PageHeading";
import AccountLayout from "../../layouts/AccountLayout";
import AccountSidebar from "../../components/structure/account/AccountSidebar";

// sections
import AccountProfileSection from "./AccountProfileSection";
import AccountSettingsSection from "./AccountSettingsSection";
import AccountLogoutSection from "./AccountLogoutSection";

const AccountPage = () => {
  const { user } = useAuth();
  const [selectedSection, setSelectedSection] = useState("profile");

  return (
    <>
      <PageHeading
        title="My Account"
        description="Manage your profile and account settings."
      />

      <AccountLayout
        sidebar={
          <AccountSidebar
            user={user}
            selectedSection={selectedSection}
            onSelectSection={setSelectedSection}
          />
        }
      >
        {selectedSection === "profile" && (
          <AccountProfileSection user={user} />
        )}

        {selectedSection === "settings" && (
          <AccountSettingsSection user={user} />
        )}

        {selectedSection === "logout" && (
          <AccountLogoutSection />
        )}
      </AccountLayout>
    </>
  );
};

export default AccountPage;