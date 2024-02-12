import React from "react";
import { Link } from "react-router-dom";
import { Box, Heading, Container, Center, Flex } from "@chakra-ui/react";

export function Footer() {
  return (
    <footer>
      <div className="container mx-auto p-4">
        <p className="text-center text-gray-500 text-sm">
          TerpText ~ Powered by{" "}
          <a href="https://terpmetrix.com" className="underline">
            Terpmetrix{" "}
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
