import { Box } from "@chakra-ui/react";
import { useLocation } from "react-router-dom";
import NavBar from "./../components/NavBar";
import Footer from "./../components/Footer";

function Layout({ children }) {
  const location = useLocation();

  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/reactivate-account") ||
    location.pathname.startsWith("/verify-email") ||
    location.pathname.startsWith("/resend-verification-email");
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="bg.dark1"
      >
      {!isAuthPage && <NavBar />}

      <Box as="main" flex="1" minH={0} bg="bg.canvas">
        {children}
      </Box>

      {!isAuthPage && <Footer />}
    </Box>
  );
}

export default Layout;
