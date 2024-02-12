import { Link } from "react-router-dom";
import useAuth from "@wasp/auth/useAuth";
import logout from "@wasp/auth/logout";
import "./styles/Main.css";
import {
  ChakraProvider,
  Tooltip,
  Stack,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Button, useToast } from "@chakra-ui/react";
import terptextLogo from "/images/terptext-logo.png";
import { TbLogout, TbLogin } from "react-icons/tb";
import { FaRegUserCircle } from "react-icons/fa";
import AgeVerificationModal from "./pages/AgeVerificationModal";
import { Footer } from "./components/Footer";

export const App = ({ children }) => {
  const { data: user } = useAuth();
  const isIndex = window.location.pathname === "/";

  return (
    <ChakraProvider>
      <AgeVerificationModal />
      <div className="flex flex-col min-h-screen bg-gray-5">
        <header className="bg-primary-700 text-white p-4">
          <div className="container mx-auto px-4 py-2 flex justify-between">
            <Link to="/" className="flex items-center gap-2">
              <img
                src={terptextLogo}
                alt="Terpmetrix Logo"
                width={35}
                height={35}
              ></img>
              <h1 className="text-[1.7em] font-semibold">TerpText</h1>
            </Link>
            {!isIndex ? (
              <div>
                {user ? (
                  <span className="mt-2">
                    <Tooltip label="Your profile" aria-label="Your profile">
                      <Button
                        to={"/user/profile"}
                        as={Link}
                        colorScheme="blue"
                        size={"md"}
                      >
                        <FaRegUserCircle />
                      </Button>
                    </Tooltip>
                    <Tooltip label="Log out" aria-label="Log out">
                      <Button
                        onClick={logout}
                        colorScheme="red"
                        size={"md"}
                        className="ml-2"
                      >
                        <TbLogout />
                      </Button>
                    </Tooltip>
                  </span>
                ) : (
                  <Stack direction="row" spacing={4}>
                    <ChakraLink
                      as={Link}
                      fontWeight={"bold"}
                      to="/login"
                      className="mt-2"
                    >
                      Log in
                    </ChakraLink>
                    <Button
                      as={Link}
                      to="/signup"
                      colorScheme="blue"
                      size={"md"}
                      fontWeight={"bold"}
                    >
                      Sign up
                    </Button>
                  </Stack>
                )}{" "}
              </div>
            ) : 
            (
              <div>
                <Button
                  as={Link}
                  to="/signup"
                  colorScheme="green"
                  size={"md"}
                  fontWeight={"bold"}
                >
                  Book a Demo
                </Button>
              </div>
            )
            }
          </div>
        </header>
        <main className="container mx-auto px-4 py-2 flex-grow">
          {children}
        </main>
        <Footer />
      </div>
    </ChakraProvider>
  );
};
