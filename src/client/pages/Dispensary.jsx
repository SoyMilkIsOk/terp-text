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
} from "@chakra-ui/react";
import { IoIosSettings } from "react-icons/io";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getDispensary from "@wasp/queries/getDispensary";
import createUserStrain from "@wasp/actions/createUserStrain"; // Assuming this action is implemented
import deleteUserStrain from "@wasp/actions/deleteUserStrain"; // Assuming this action is implemented

export function DispensaryPage() {
  const { dispensaryName } = useParams();
  useEffect(() => {
    document.title =
      "TerpText - " +
      dispensaryName.charAt(0).toUpperCase() +
      dispensaryName.slice(1);
  }, []);
  const { data: user } = useAuth();
  const toast = useToast();

  const {
    data: dispensary,
    isLoading: dispensaryLoading,
    error: dispensaryError,
  } = useQuery(getDispensary, { name: dispensaryName });

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

  const handleChange = async (strainId, isChecked) => {
    setNotificationSettings((prevSettings) =>
      new Map(prevSettings).set(strainId, isChecked)
    );
    try {
      if (isChecked) {
        await createUserStrainFn({ strainId, dispensaryName });
      } else {
        await deleteUserStrainFn({ strainId, dispensaryName });
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

  return (
    <Container maxW="max-content">
      <Box p={4}>
        <Flex>
          <Heading as="h1" size="xl" mb={4}>
            {dispensaryName.charAt(0).toUpperCase() + dispensaryName.slice(1)}
          </Heading>
          <Spacer />
          {user?.username === dispensaryName && (
            <Button
              as={Link}
              to={"/" + dispensaryName + "/dashboard"}
              colorScheme="blue"
              size="md"
              >
              <IoIosSettings />
            </Button>
          )}
        </Flex>
    
        {!user ? (
          <Center>
            <Box>Please log in to manage your notifications.</Box>
          </Center>
        ) : (
          <Box mt={4}>
            <Heading as="h2" size="lg" mb={2}>
              Strain Notifications:
            </Heading>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Strain</Th>
                  <Th>Grower</Th>
                  <Th>Status</Th>
                  <Th>Last Available</Th>
                  <Th isNumeric>Notification</Th>
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
                        <span className="ml-4">
                          {i.available ? "✅" : "⏰"}
                        </span>
                      </Tooltip>
                    </Td>
                    <Td>
                      {new Date(i.availableDate).toLocaleDateString("en-US")}
                    </Td>
                    <Td isNumeric>
                      <Switch
                        mr={7}
                        isChecked={notificationSettings.get(i.strain.id)}
                        onChange={(e) =>
                          handleChange(i.strain.id, e.target.checked)
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Box>
    </Container>
  );
}    