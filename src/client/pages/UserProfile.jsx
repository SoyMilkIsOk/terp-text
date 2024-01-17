import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Input,
  useToast,
  Switch,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  Center,
  Container,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { FaRegSave } from "react-icons/fa";
import { FaRegCircleXmark } from "react-icons/fa6";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import getUser from "@wasp/queries/getUser";
import updatePhone from "@wasp/actions/updatePhone"; // Assume this action is implemented
import unsubscribeFromTexts from "@wasp/actions/unsubscribeFromTexts"; // Assume this action is implemented
import createUserDispensary from "@wasp/actions/createUserDispensary"; // Assume this action is implemented
import deleteUserDispensary from "@wasp/actions/deleteUserDispensary"; // Assume this action is implemented

export const UserProfile = () => {
  const { data: user } = useAuth();
  const toast = useToast();
  const [phone, setPhone] = useState("");
  const [dispensaries, setDispensaries] = useState([]);
  const { data: userProfile, refetch } = useQuery(getUser, {
    username: user?.username,
  });

  useEffect(() => {
    setPhone(user?.phone || "");
    setDispensaries(
      userProfile?.strains
        .map((s) => s.dispensary)
        .filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i)
        .map((d) => ({ ...d, enabled: true }))
    );
  }, [user, userProfile]);

  const handlePhoneUpdate = async () => {
    try {
      await updatePhone({ phone });
      toast({ title: "Phone number updated", status: "success" });
    } catch (error) {
      toast({ title: "Error updating phone number", status: "error" });
    }
  };

  const handleUnsubscribe = async () => {
    try {
      await unsubscribeFromTexts();
      toast({ title: "Unsubscribed from all texts", status: "success" });
    } catch (error) {
      toast({ title: "Error in unsubscribing", status: "error" });
    }
  };

  const handleDispensaryChange = async (dispensaryName, isChecked) => {
    try {
      if (isChecked) {
        await createUserDispensary({ dispensaryName });
      } else {
        await deleteUserDispensary({ dispensaryName });
      }
      toast({
        title: isChecked ? "Subscribed" : "Unsubscribed",
        status: "success",
        duration: 1000,
        isClosable: true,
      });
      setDispensaries((prevSettings) =>
        prevSettings.map((d) =>
          d.name === dispensaryName ? { ...d, enabled: isChecked } : d
        )
      );
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

  if (!user) {
    return <Box>You need to be logged in to view this page.</Box>;
  }

  if (!userProfile) {
    return <Box>Loading...</Box>;
  }

  return (
    <Container maxW="max-content">
      <Box p={4}>
        <Heading as="h1" mb={4}>
          User Profile
        </Heading>
        <FormControl>
          <FormLabel>Update Phone Number</FormLabel>
          <Flex>
            <Input
              onChange={(e) => setPhone(e.target.value)}
              placeholder={user.phone || "Phone Number"}
              maxW={"max-content"}
            />
            <Button
              leftIcon={<FaRegSave />}
              onClick={handlePhoneUpdate}
              colorScheme="blue"
              ml={2}
            >
              Save
            </Button>
          </Flex>
        </FormControl>
        <FormControl>
          <FormLabel mt={4}>Update Notifications</FormLabel>
          <Table mt={4}>
            <Thead>
              <Tr>
                <Th>Dispensary</Th>
                <Th isNumeric>Notification</Th>
              </Tr>
            </Thead>
            <Tbody>
              {(!dispensaries || !dispensaries.length) && (
                <Tr>
                  <Td colSpan={2}>
                    {" "}
                    <Center>No notifications set up. </Center>
                  </Td>
                </Tr>
              )}
              {dispensaries?.map((dispensary) => (
                <Tr key={dispensary.name}>
                  <Td>
                    <ChakraLink
                      as={Link}
                      to={`/${dispensary.name}`}
                      color="blue.500"
                    >
                      {dispensary.name.charAt(0).toUpperCase() +
                        dispensary.name.slice(1)}
                    </ChakraLink>
                  </Td>
                  <Td isNumeric>
                    <Switch
                      isChecked={dispensary.enabled}
                      onChange={(e) =>
                        handleDispensaryChange(
                          dispensary.name,
                          e.target.checked
                        )
                      }
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
          <Flex mt={4}>
            {dispensaries?.length > 0 && (
              <Button
                leftIcon={<FaRegCircleXmark />}
                onClick={handleUnsubscribe}
                colorScheme="red"
              >
                Unsubscribe All
              </Button>
            )}
          </Flex>
        </FormControl>
      </Box>
    </Container>
  );
};
