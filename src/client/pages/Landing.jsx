import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  Heading,
  Container,
  Center,
  Flex,
  Button,
  Spacer,
  VStack,
  SimpleGrid,
} from "@chakra-ui/react";
import cn from "classnames";
import styles from "../styles/messages.module.scss";
import { AuthContext } from "@wasp/auth/forms/Auth";

export const Landing = () => {
  const messages = [
    {
      text: "When will you have ___ again?",
      sent: true,
    },
    {
      text: "I miss ____. When's it coming back?",
    },
  ];

  const isMobile = window.innerWidth < 768;

  return (
    <Container maxW="container.lg">
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={12} height={"80vh"}>
        <Box m={"auto"} textAlign={"center"}>
          <VStack spacing={8}>
          <Heading as="h2" size="2xl" textAlign="center">
Turn inquiry into opportunity with TerpText.
          </Heading>
          <Center textAlign={"center"}>
            <p className="text-lg">
            The first strain notification platform, helping dispensaries connect consumers with their favorites.
            </p>
          </Center>
          </VStack>
        </Box>
        <Box my={"auto"} className="hidden md:block">
          <ol className={styles.list}>
            {messages.map(({ text, sent }, i) => {
              const isLast = i === messages.length - 1;
              const noTail = !isLast && messages[i + 1]?.sent === sent;
              return (
                <li
                  key={text}
                  className={cn(
                    styles.shared,
                    sent ? styles.sent : styles.received,
                    noTail && styles.noTail
                  )}
                >
                  {text}
                </li>
              );
            })}
          </ol>{" "}
        </Box>
      </SimpleGrid>
    </Container>
  );
};

export default Landing;
