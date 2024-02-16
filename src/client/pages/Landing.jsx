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
  Stack,
  SimpleGrid,
} from "@chakra-ui/react";
import cn from "classnames";
import styles from "../styles/messages.module.scss";
import { IoIosMegaphone } from "react-icons/io";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaUsers } from "react-icons/fa6";
import { FaBell } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { FaQuestionCircle } from "react-icons/fa";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { useEffect } from "react";
import { PopupButton } from "react-calendly";

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

  useEffect(() => {
    document.title = "TerpText - Welcome to the Future of Cannabis";
  }, []);

  const demoURL = "https://calendly.com/terpmetrix/terptext-demo";

  const isMobile = window.innerWidth < 768;

  return (
    <Container maxW="container.lg">
      <SimpleGrid
        columns={{ sm: 1, md: 2 }}
        spacing={40}
        mx={"auto"}
        className="my-10 sm:my-24 md:my-40"
      >
        <Box m={"auto"} textAlign={"center"}>
          <VStack spacing={8}>
            <Heading as="h2">
              Turn inquiry into opportunity with TerpText.
            </Heading>
            <Center textAlign={"center"}>
              <p className="text-lg">
                The first strain notification platform for dispensaries - helping
                connect consumers with their favorite products.
              </p>
            </Center>
          </VStack>
        </Box>
        <Box my={[null, 0, 8]} className="hidden sm:block">
          {/* code from */}
          {/* https://samuelkraft.com/blog/ios-chat-bubbles-css */}
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
                    noTail && styles.noTail,
                  )}
                >
                  {text}
                </li>
              );
            })}
          </ol>{" "}
        </Box>
      </SimpleGrid>

      <Stack direction={["column", "row"]} spacing={[6,0]} my={24}>
        {/* circle div for features */}
        <Stack
          direction={["row", "column"]}
          textAlign="center"
          spacing={8}
          mx={"auto"}
        >
          <Center>
            <div className="rounded-full bg-[#0b93f6] w-[5em] h-[5em] p-[1.4em]">
              <IoIosMegaphone className="text-white text-4xl" />
            </div>
          </Center>
          <VStack>
            <Heading size={"md"} textAlign="center">
              Direct Communication
            </Heading>
            <Center>
              <p className="text-lg w-[10em]">
                Notify your customers as soon as new strains are available.
              </p>
            </Center>
          </VStack>
        </Stack>
        <Spacer />
        <Stack
          direction={["row", "column"]}
          textAlign="center"
          spacing={8}
          mx={"auto"}
        >
          <Center>
            <div className="rounded-full bg-[#0b93f6] w-[5em] h-[5em] p-[1.4em]">
              <BsGraphUpArrow className="text-white text-4xl" />
            </div>
          </Center>
          <VStack>
            <Heading size={"md"} textAlign="center">
              Market Responsiveness
            </Heading>
            <Center>
              <p className="text-lg w-[10em]">
                Sell your stock faster and know what to order more of.
              </p>
            </Center>
          </VStack>
        </Stack>
        <Spacer />
        <Stack
          direction={["row", "column"]}
          textAlign="center"
          spacing={8}
          mx={"auto"}
        >
          <Center>
            <div className="rounded-full bg-[#0b93f6] w-[5em] h-[5em] p-[1.4em]">
              <FaUsers className="text-white text-4xl" />
            </div>
          </Center>
          <VStack>
            <Heading size={"md"} textAlign="center">
              Customer Retention
            </Heading>
            <Center>
              <p className="text-lg w-[10em]">
                Keep your customers coming back for their favorite products.
              </p>
            </Center>
          </VStack>
        </Stack>
      </Stack>

      <Flex direction={["column", "row"]} my={20}>
        <Box my={'auto'}>
          <Heading as="h2" size="xl" textAlign="center">
            How It Works
          </Heading>
        </Box>
        <Spacer />
        <SimpleGrid w={['100%','65%']} columns={{ sm: 1, md: 2 }} spacing={8} mx={"auto"} my={8} textAlign={"center"}>
          <Box borderWidth='1px' borderRadius='lg' p={8} boxShadow={'xl'} bg={'gray.1'}>
          <div className="relative w-full mb-6">
            <Heading pl={1} pt={1} as="h3" size="md" textAlign={'left'} opacity={'80%'} >
              Onboarding
            </Heading>
            <AiFillShop className="text-3xl absolute top-0 right-1 text-[#0b93f6]" />
            </div>
              <p className="text-lg">
              Sign up your dispensary and add your most popular strains to your menu.
              </p>
          </Box>
          <Box borderWidth='1px' borderRadius='lg' p={8} boxShadow={'xl'} bg={'gray.1'}>
          <div className="relative w-full mb-6">
            <Heading pl={1} pt={1} as="h3" size="md" textAlign={'left'} opacity={'80%'} >
              Get Questions
            </Heading>
            <FaQuestionCircle className="text-3xl absolute top-0 right-1 text-[#0b93f6]" />
            </div>
              <p className="text-lg">
              Customers ask budtender about when their favorite strains will be available.
              </p>
          </Box>
          <Box borderWidth='1px' borderRadius='lg' p={8} boxShadow={'xl'} bg={'gray.1'}>
          <div className="relative w-full mb-6">
            <Heading pl={1} pt={1} as="h3" size="md" textAlign={'left'} opacity={'80%'} >
              Scan QR
            </Heading>
            <MdOutlineQrCodeScanner className="text-3xl absolute top-0 right-1 text-[#0b93f6]" />
            </div>
              <p className="text-lg">
              Customers scan QR code at register and sign up for email/text notifications.
              </p>
          </Box>
          <Box borderWidth='1px' borderRadius='lg' p={8} boxShadow={'xl'} bg={'gray.1'}>
            <div className="relative w-full mb-6">
            <Heading pl={1} pt={1} as="h3" size="md" textAlign={'left'} opacity={'80%'} >
              Get Notified
            </Heading>
            <FaBell className="text-3xl absolute top-0 right-1 text-[#0b93f6]" />
            </div>
              <p className="text-lg">
              Update your inventory and notify customers instantly when new strains drop.
              </p>
          </Box>
        </SimpleGrid>
      </Flex>
    </Container>
  );
};

export default Landing;
