// React Router
import { useLocation } from "react-router-dom";

// Chakra UI
import { Box } from "@chakra-ui/react";

// Components
import Footer from "../components/Footer";
import NavBar from "../components/NavBar";
import RateLimitBanner from "../components/RateLimitBanner";

function Layout({ children }) {
  const location = useLocation();

  const isAuthPage =
    location.pathname.startsWith("/login") ||
    location.pathname.startsWith("/register") ||
    location.pathname.startsWith("/forgot-password") ||
    location.pathname.startsWith("/reset-password") ||
    location.pathname.startsWith("/reactivate-account") ||
    location.pathname.startsWith("/verify-email") ||
    location.pathname.startsWith("/update-email") ||
    location.pathname.startsWith("/resend-verification-email");
  return (
    <Box
      minH="100vh"
      display="flex"
      flexDirection="column"
      bg="bg.dark1"
      bgGradient="
          radial-gradient(
          circle at center,
          rgba(80, 80, 80, 0.35) 0%,
          rgba(30, 30, 30, 0.6) 40%,
          rgba(20, 20, 20, 1) 100%
          )
      "
      >
      {!isAuthPage && <NavBar />}

      <RateLimitBanner />


      <Box as="main" flex="1" minH={0} bg="bg.canvas">
        {children}
      </Box>

      {!isAuthPage && <Footer />}
    </Box>
  );
}

export default Layout;
