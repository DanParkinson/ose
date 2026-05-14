import AccountLayout from "../../layouts/AccountLayout";
import AccountProfileSection from "../Account/AccountProfileSection";
import AccountPasswordSection from "../Account/AccountPasswordSection";
import AccountDeactivateSection from "../Account/AccountDeactivateSection";

const Account = () => {
  return (
    <AccountLayout>
      <AccountProfileSection />
      <AccountPasswordSection />
      <AccountDeactivateSection />
    </AccountLayout>
  );
}

export default Account;
