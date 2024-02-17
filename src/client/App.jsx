import { Link } from "react-router-dom";
import useAuth from "@wasp/auth/useAuth";
import logout from "@wasp/auth/logout";
import "./styles/Main.css";
import {
  ChakraProvider,
  Tooltip,
  Stack,
  Button,
  Box,
  Flex,
  Image,
  Text,
} from "@chakra-ui/react";
import { TbLogout, TbLogin } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import AgeVerificationModal from "./pages/AgeVerificationModal";
import { Footer } from "./components/Footer";
import { PopupButton } from "react-calendly";
import { Link as ScrollLink } from "react-scroll"; // Import for smooth scrolling
import terptextLogo from "/images/terptext-logo.png"; // Ensure the path to the logo is correct

export const App = ({ children }) => {
  const { data: user } = useAuth();
  const isIndex = window.location.pathname === "/";
  const isDemo = window.location.pathname === "/book-a-demo";
  const demoURL = "https://calendly.com/terpmetrix/terptext-demo";

  return (
    <ChakraProvider>
      <AgeVerificationModal />
      <Flex direction="column" minHeight="100vh" backgroundColor="gray.50">
        {/* Navigation Bar */}
        <Box
          backgroundColor="blue.700"
          color="white"
          padding="4"
          position="sticky" // Make navbar sticky
          top="0" // Stick to the top
          zIndex="sticky" // Ensure navbar stays on top of other content
        >
          <Flex justifyContent="space-between" alignItems="center" maxWidth="container.xl" marginX="auto">
            <Link to="/" className="flex items-center gap-2">
              <Image src={terptextLogo} alt="TerpText Logo" boxSize="35px" />
              <Text fontSize="1.7em" fontWeight="semibold">TerpText</Text>
            </Link>
            <Stack direction="row" spacing={4} align="center">
              {isIndex && (
                <>
                  <ScrollLink to="features" smooth={true} duration={500} offset={-100}>
                    <Button variant="link" textColor={"white"} mx={2}>Features</Button>
                  </ScrollLink>
                  <ScrollLink to="how-it-works" smooth={true} duration={500} offset={-100}>
                    <Button variant="link" textColor={"white"} mx={2}>How It Works</Button>
                  </ScrollLink>
                </>
              )}
              {!isIndex && user && (
                <>
                  <Tooltip label="Your profile" aria-label="Your profile">
                    <Button as={Link} to="/user/profile" colorScheme="blue">
                      <FaRegUserCircle />
                    </Button>
                  </Tooltip>
                  <Tooltip label="Log out" aria-label="Log out">
                    <Button onClick={logout} colorScheme="red">
                      <TbLogout />
                    </Button>
                  </Tooltip>
                </>
              )}
              {!isIndex && !user && (
                <>
                  <Button as={Link} to="/login" colorScheme="blue">
                    Log in
                  </Button>
                  <Button as={Link} to="/signup" colorScheme="green">
                    Sign up
                  </Button>
                </>
              )}
              {isIndex && (
                <PopupButton url={demoURL} text="Book a Demo" className="bg-[#0b93f6] text-white px-4 py-2 rounded-lg" />
              )}
            </Stack>
          </Flex>
        </Box>

        {/* Main Content */}
        <Box flex="1" paddingY="4" maxWidth="container.xl" marginX="auto">
          {children}
        </Box>

        <Footer />
      </Flex>
    </ChakraProvider>
  );
};
