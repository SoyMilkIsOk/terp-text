import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Box,
  Heading,
  useToast,
  Tooltip,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Switch,
  Container,
  Flex,
  Spacer,
  Center,
  Text,
  HStack,
  VStack,
  Divider,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { IoIosSettings } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { FaPlug } from "react-icons/fa6";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getDispensary from "@wasp/queries/getDispensary";
import createUserStrain from "@wasp/actions/createUserStrain";
import deleteUserStrain from "@wasp/actions/deleteUserStrain";

export function DispensaryPage() {
  const { slug } = useParams();

  const { data: user } = useAuth();
  const toast = useToast();

  const {
    data: dispensary,
    isLoading: dispensaryLoading,
    error: dispensaryError,
  } = useQuery(getDispensary, { slug: slug });

  useEffect(() => {
    document.title = "TerpText - " + dispensary?.name;
  }, []);

  const createUserStrainFn = useAction(createUserStrain);
  const deleteUserStrainFn = useAction(deleteUserStrain);

  const [notificationSettings, setNotificationSettings] = useState(new Map());

  useEffect(() => {
    if (dispensary && user) {
      const userSubscriptions = new Map(
        dispensary.userStrains
          .filter((us) => us.userId === user.id)
          .map((us) => [us.strainId, true])
      );
      setNotificationSettings(userSubscriptions);
    }
  }, [dispensary, user]);

  const handleChange = async (strainId, isChecked, slug) => {
    setNotificationSettings((prevSettings) =>
      new Map(prevSettings).set(strainId, isChecked)
    );
    try {
      if (dispensaryName) {
        if (isChecked) {
          await createUserStrainFn({ strainId, dispensarySlug: slug });
        } else {
          await deleteUserStrainFn({ strainId, dispensarySlug: slug });
        }
      }
      toast({
        title: isChecked ? "Subscribed" : "Unsubscribed",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: "Error",
        description: `Error: ${err.message}`,
        status: "error",
        duration: 1000,
        isClosable: true,
      });
    }
  };

  if (dispensaryLoading) return <Box>Loading...</Box>;
  if (dispensaryError) return <Box>Error: {dispensaryError}</Box>;

  const strains = dispensary?.strains;
  const dispensaryName = dispensary?.name;

  return (
    <Container maxW="max-content">
      <Box p={4}>
        <Flex>
          <Heading as="h1" size="xl" mb={4}>
            {dispensary?.name}
          </Heading>
          <Spacer />
          {user?.username === slug ? (
            <Button
              as={Link}
              rightIcon={<IoIosSettings />}
              to={"/" + slug + "/dashboard"}
              colorScheme="blue"
              size="md"
            >
              Dashboard
            </Button>
          ) : (
            <HStack>
              {dispensary.phone && (
                <Button //call button
                  as={"a"}
                  rightIcon={<IoCall />}
                  href={"tel:" + dispensary.phone}
                  colorScheme="blue"
                  size="sm"
                >
                  Call
                </Button>
              )}
              {dispensary.website && (
                <Button
                  as={"a"}
                  rightIcon={<FaPlug />}
                  href={dispensary.website}
                  colorScheme="blue"
                  size="sm"
                >
                  Menu
                </Button>
              )}
            </HStack>
          )}
        </Flex>
        <Box mt={4}>
          <Heading as="h2" size="lg" mb={2}>
            Strains:
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Strain</Th>
                <Th>Grower</Th>
                <Th>Status</Th>
                <Th>Last Available</Th>
                <Th isNumeric>Notifications</Th>
              </Tr>
            </Thead>
            <Tbody>
              {strains?.map((i) => (
                <Tr key={i.strain.id}>
                  <Td>{i.strain.name}</Td>
                  <Td>{i.strain.grower}</Td>
                  <Td>
                    <Tooltip
                      label={
                        i.available
                          ? "Currently Available"
                          : "Currently Unavailable"
                      }
                      aria-label="A tooltip"
                      placement="right"
                      hasArrow
                    >
                      <span className="ml-4">{i.available ? "✅" : "⏰"}</span>
                    </Tooltip>
                  </Td>
                  <Td>
                    {new Date(i.availableDate).toLocaleDateString("en-US")}
                  </Td>
                  {user ? (
                    <Td isNumeric>
                      <Switch
                        mr={7}
                        isChecked={notificationSettings.get(i.strain.id)}
                        onChange={(e) =>
                          handleChange(
                            i.strain.id,
                            e.target.checked,
                            slug
                          )
                        }
                      />
                    </Td>
                  ) : (
                    <Td isNumeric>
                      <Tooltip
                        label="Please sign up or log in to manage your notifications."
                        aria-label="A tooltip"
                        placement="right"
                        hasArrow
                      >
                        <Text mr={10}>🔒</Text>
                      </Tooltip>
                    </Td>
                  )}
                </Tr>
              ))}
            </Tbody>
          </Table>
          {!user && (
            <Center>
              <VStack direction="row" spacing={3} mt={6}>
                <Button
                  as={Link}
                  to="/signup"
                  colorScheme="blue"
                  size={"md"}
                  fontWeight={"bold"}
                >
                  Sign up
                </Button>
                <Divider />
                <Button
                  as={Link}
                  fontWeight={"bold"}
                  to="/login"
                  variant={"outline"}
                  colorScheme="blue"
                >
                  Log in
                </Button>
              </VStack>
            </Center>
          )}
        </Box>
      </Box>
    </Container>
  );
}
