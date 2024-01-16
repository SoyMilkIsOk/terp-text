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
  Checkbox,
  Flex,
  Spacer,
  FormControl,
  FormLabel,
  Container,
  Link as ChakraLink,
} from "@chakra-ui/react";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getUser from "@wasp/queries/getUser";
import enrollUser from "@wasp/actions/enrollUser";
import { RxUpdate } from "react-icons/rx";
import { FaRegCircleXmark } from "react-icons/fa6";
import { FaRegSave } from "react-icons/fa";
import { Link } from "react-router-dom";

export const UserProfile = () => {
  const { data: user } = useAuth();
  const toast = useToast();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [dispensaries, setDispensaries] = useState([]);
  const { data: userProfile, refetch } = useQuery(getUser, {
    username: user?.username,
  });

  //   // extract unique dispensaries from userProfile.strains.dispensary
  // setDispensaries(userProfile?.strains
  //     .map((s) => s.dispensary)
  //     .filter((v, i, a) => a.indexOf(v) === i));

  useEffect(() => {
    setPhoneNumber(user?.phone || "");
    // Fetch strain notifications (this function needs to be implemented)
    setDispensaries(
      // extract unique
      userProfile?.strains
        .map((s) => s.dispensary)
        // filter to remove duplicate dispensary.name entries (check to see if name is already in array)
        .filter((v, i, a) => a.findIndex((t) => t.name === v.name) === i)
        .map((d) => ({ ...d, enabled: true }))
    );
  }, [user, userProfile]);

  const handlePhoneUpdate = async () => {
    try {
      // Update phone number action (needs to be implemented)
      await updatePhoneNumber({ phoneNumber });
      toast({ title: "Phone number updated", status: "success" });
    } catch (error) {
      toast({ title: "Error updating phone number", status: "error" });
    }
  };

  const handleUnsubscribe = async () => {
    try {
      // Unsubscribe action (needs to be implemented)
      await unsubscribeFromTexts();
      toast({ title: "Unsubscribed from all texts", status: "success" });
    } catch (error) {
      toast({ title: "Error in unsubscribing", status: "error" });
    }
  };

  if (!user) {
    return <Box>You need to be logged in to view this page</Box>;
  }

  if (!userProfile) {
    return <Box>Loading...</Box>;
  }

  const handleDispensaryChange = (dispensaryName, isChecked) => {
    //     setDispensaries(prevSettings =>
    // //
    //     );
  };

  const handleUpdateNotifications = async () => {
    //
  };

  return (
    <Container maxW="max-content">
      <Box p={4}>
        <Heading as="h1" mb={4}>
          {" "}
          User Profile{" "}
        </Heading>
        <FormControl>
          <FormLabel>Update Phone Number</FormLabel>
          <Flex>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="Phone Number"
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
              {console.log("dispensaries", dispensaries)}
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
                    <Checkbox
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
          <Flex mt={4} display={"flex"} minW={"max-content"}>
            <Button
              leftIcon={<FaRegSave />}
              colorScheme="blue"
              onClick={handleUpdateNotifications}
            >
              Save
            </Button>
            <Spacer />
            <Button
              leftIcon={<FaRegCircleXmark />}
              onClick={handleUnsubscribe}
              colorScheme="red"
              alignSelf={"flex-end"}
            >
              Unsubscribe All
            </Button>
          </Flex>
        </FormControl>
      </Box>
    </Container>
  );
};
