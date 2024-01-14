import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  Button,
  Stack,
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
  Checkbox,
  Container,
} from "@chakra-ui/react";
import { IoMdLogIn } from "react-icons/io";
import { RxUpdate } from "react-icons/rx";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getDispensary from "@wasp/queries/getDispensary";
import enrollUser from "@wasp/actions/enrollUser";

export function DispensaryPage() {
  const { dispensaryName } = useParams();
  const { data: user } = useAuth();
  const enrollUserFn = useAction(enrollUser);
  const toast = useToast();

  const {
    data: dispensary,
    isLoading: dispensaryLoading,
    error: dispensaryError,
  } = useQuery(getDispensary, { name: dispensaryName });

  const [notificationSettings, setNotificationSettings] = useState([]);

  useEffect(() => {
    if (dispensary && user) {
      const userSubscriptions = dispensary.userStrains
        .filter((us) => us.userId === user.id)
        .map((us) => us.strainId);
      setNotificationSettings(userSubscriptions);
    }
  }, [dispensary, user]);

  const handleEnrollOrUpdate = () => {
    const actionType =
      notificationSettings.length === 0 && !isUserEnrolled
        ? "Enroll"
        : "Update";
    enrollUserFn({
      dispensaryName,
      notificationSettings,
      update: actionType === "Update",
    })
      .then(() =>
        toast({
          title: `${actionType} Successful!`,
          status: "success",
          duration: 1000,
          isClosable: true,
        })
      )
      .catch((err) =>
        toast({
          title: "Error",
          description: `Error: ${err.message}`,
          status: "error",
          duration: 1000,
          isClosable: true,
        })
      );
  };

  const handleChange = (strainId, isChecked) => {
    setNotificationSettings((prevSettings) =>
      isChecked
        ? [...prevSettings, strainId]
        : prevSettings.filter((id) => id !== strainId)
    );
  };

  if (dispensaryLoading) return <Box>Loading...</Box>;
  if (dispensaryError) return <Box>Error: {dispensaryError}</Box>;

  const isUserEnrolled = dispensary.userStrains.some(
    (us) => us.userId === user?.id
  );

  const strains = dispensary?.strains;

  return (
    <Container maxW="max-content">
      <Box p={4}>
        <Heading as="h1" size="xl" mb={4}>
          {dispensaryName.charAt(0).toUpperCase() + dispensaryName.slice(1)}
          {isUserEnrolled && (
            <Tooltip
              label="User is enrolled in notifications from this dispensary"
              aria-label="A tooltip"
              placement="right"
              hasArrow
            >
              <span> ✅</span>
            </Tooltip>
          )}
        </Heading>

        {!user ? (
          <Stack direction="row" spacing={4}>
            <Link to="/login">
              <Button leftIcon={<IoMdLogIn />} colorScheme="blue">
                Login
              </Button>
            </Link>
          </Stack>
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
                  <Th>Last Availble</Th>
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
                      <Checkbox
                        className="mr-10"
                        isChecked={notificationSettings.includes(i.strain.id)}
                        onChange={(e) =>
                          handleChange(i.strain.id, e.target.checked)
                        }
                      />
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            <Button
              colorScheme="blue"
              onClick={handleEnrollOrUpdate}
              leftIcon={<RxUpdate />}
              mt={4}
            >
              {isUserEnrolled ? "Update" : "Enroll"}
            </Button>
          </Box>
        )}
      </Box>
    </Container>
  );
}
