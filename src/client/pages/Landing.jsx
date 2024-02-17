import React, { useEffect } from "react";
import {
  Box,
  Heading,
  Container,
  Center,
  Flex,
  VStack,
  Stack,
  SimpleGrid,
  Spacer,
  Button,
} from "@chakra-ui/react";
import cn from "classnames";
import styles from "../styles/messages.module.scss";
import { motion } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { IoIosMegaphone } from "react-icons/io";
import { BsGraphUpArrow } from "react-icons/bs";
import { FaUsers, FaBell, FaQuestionCircle } from "react-icons/fa";
import { AiFillShop } from "react-icons/ai";
import { MdOutlineQrCodeScanner } from "react-icons/md";
import { PopupButton } from "react-calendly";

const MotionBox = motion(Box);

export const Landing = () => {
  const demoURL = "https://calendly.com/terpmetrix/terptext-demo";

  useEffect(() => {
    document.title = "TerpText - Welcome to the Future of Cannabis";
  }, []);

  const messages = [
    {
      text: "When will you have ___ again?",
      sent: true,
    },
    {
      text: "I miss ____. When's it coming back?",
    },
  ];

  const slideInVariant = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const { ref: ref1, inView: inView1 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref2, inView: inView2 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref3, inView: inView3 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref4, inView: inView4 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref5, inView: inView5 } = useInView({ triggerOnce: true, threshold: 0.5 });
  const { ref: ref6, inView: inView6 } = useInView({ triggerOnce: true, threshold: 0.5 });

  return (
    <Container maxW="container.lg">
      <SimpleGrid columns={{ sm: 1, md: 2 }} spacing={40} mx="auto" className="my-20 sm:my-48 md:my-60">
        <MotionBox ref={ref1} variants={slideInVariant} initial="hidden" animate={inView1 ? "visible" : "hidden"}>
          <Box m="auto" textAlign="center">
            <VStack spacing={8}>
              <Heading as="h2">Turn inquiry into opportunity with TerpText.</Heading>
              <Center textAlign="center">
                <p className="text-lg">
                  The first strain notification platform for dispensaries - helping
                  connect consumers with their favorite products.
                </p>
              </Center>
              <PopupButton url={demoURL} text="Book a Demo" className="bg-[#0b93f6] text-white px-4 py-2 rounded-lg" />
            </VStack>
          </Box>
        </MotionBox>

        <MotionBox ref={ref2} variants={slideInVariant} initial="hidden" animate={inView2 ? "visible" : "hidden"}>
          <Box my={[null, 0, 8]} className="hidden sm:block">
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
            </ol>
          </Box>
        </MotionBox>
      </SimpleGrid>

      <Heading as="h2" size="xl" textAlign="center" mt={48} id="features">Features</Heading>
      <Stack direction={["column", "row"]} spacing={[6, 0]} my={24}>
        <MotionBox ref={ref3} variants={slideInVariant} initial="hidden" animate={inView3 ? "visible" : "hidden"}>
          <FeatureCircle Icon={IoIosMegaphone} title="Direct Communication" text="Notify your customers as soon as new strains are available." />
        </MotionBox>
        <Spacer />
        <MotionBox ref={ref4} variants={slideInVariant} initial="hidden" animate={inView4 ? "visible" : "hidden"}>
          <FeatureCircle Icon={BsGraphUpArrow} title="Market Responsiveness" text="Sell your stock faster and know what to order more of." />
        </MotionBox>
        <Spacer />
        <MotionBox ref={ref5} variants={slideInVariant} initial="hidden" animate={inView5 ? "visible" : "hidden"}>
          <FeatureCircle Icon={FaUsers} title="Customer Retention" text="Keep your customers coming back for their favorite products." />
        </MotionBox>
      </Stack>
              
      <Flex direction={["column", "row"]} my={20} id="how-it-works">
      <MotionBox ref={ref6} variants={slideInVariant} initial="hidden" animate={inView6 ? "visible" : "hidden"}>
          <Heading as="h2" size="xl" textAlign="center" my={48}>How It Works</Heading>
      </MotionBox>
      <Spacer />
      <SimpleGrid w={['100%','65%']} columns={{ sm: 1, md: 2 }} spacing={8} mx={"auto"} my={8} textAlign={"center"}>
        <InfoSection Icon={AiFillShop} title="Onboarding" text="Sign up your dispensary and add your most popular strains to your menu." />
        <InfoSection Icon={FaQuestionCircle} title="Get Questions" text="Customers ask budtender about when their favorite strains will be available." />
        <InfoSection Icon={MdOutlineQrCodeScanner} title="Scan QR" text="Customers scan QR code at register and sign up for email/text notifications." />
        <InfoSection Icon={FaBell} title="Get Notified" text="Update your inventory and notify customers instantly when new strains drop." />
      </SimpleGrid>
    </Flex>
    </Container>
  );
};

const FeatureCircle = ({ Icon, title, text }) => (
  <Stack direction={["row", "column"]} textAlign="center" spacing={8} mx="auto">
    <Center>
      <div className="rounded-full bg-[#0b93f6] w-[5em] h-[5em] p-[1.4em]">
        <Icon className="text-white text-4xl" />
      </div>
    </Center>
    <VStack>
      <Heading size="md" textAlign="center">{title}</Heading>
      <Center>
        <p className="text-lg w-[10em]">{text}</p>
      </Center>
    </VStack>
  </Stack>
);

const InfoSection = ({ Icon, title, text }) => (
  <Box borderWidth='1px' borderRadius='lg' p={8} boxShadow={'xl'} bg={'gray.20'}>
    <div className="relative w-full mb-6">
      <Heading pl={1} pt={1} as="h3" size="md" textAlign={'left'} opacity={'80%'}>
        {title}
      </Heading>
      <Icon className="text-3xl absolute top-0 right-1 text-[#0b93f6]" />
    </div>
    <p className="text-lg">{text}</p>
  </Box>
);

export default Landing;
