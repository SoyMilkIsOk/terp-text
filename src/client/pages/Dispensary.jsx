import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button, Stack } from "@chakra-ui/react";
import { IoMdLogIn } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getDispensary from "@wasp/queries/getDispensary";
import enrollUser from "@wasp/actions/enrollUser";

export function DispensaryPage() {
  // Extracting parameters from URL
  const { dispensaryName } = useParams();
  // Authentication hook to get user data
  const { data: user } = useAuth();
  // Action hook for enrolling or updating user notifications
  const enrollUserFn = useAction(enrollUser);

  // Fetching dispensary data using custom query hook
  const {
    data: dispensary,
    isLoading: dispensaryLoading,
    error: dispensaryError,
  } = useQuery(getDispensary, { name: dispensaryName });

  // State for managing user's notification settings
  const [notificationSettings, setNotificationSettings] = useState([]);

  // Effect hook for initializing notification settings from fetched dispensary data
  useEffect(() => {
    if (dispensary && user) {
      const userSubscriptions = dispensary.userStrains
        .filter(us => us.userId === user.id)
        .map(us => us.strainId);
      setNotificationSettings(userSubscriptions);
      console.log("Initialized notification settings:", userSubscriptions);
    }
  }, [dispensary, user]);

  // Function to handle user enrollment or updates
  const handleEnrollOrUpdate = () => {
    const actionType = (notificationSettings.length === 0 && !isUserEnrolled) ? 'Enroll' : 'Update';
    enrollUserFn({ dispensaryName, notificationSettings, update: actionType === 'Update' })
      .then(() => alert(`${actionType} Successful!`))
      .catch(err => alert(`Error: ${err.message}`));
  };

  // Function to handle changes in checkbox state
  const handleChange = (strainId, isChecked) => {
    setNotificationSettings(prevSettings => {
      const newSettings = isChecked
        ? [...prevSettings, strainId]
        : prevSettings.filter(id => id !== strainId);
      console.log("Updated notification settings:", newSettings);
      return newSettings;
    });
  };

  // Loading and error handling
  if (dispensaryLoading) return "Loading...";
  if (dispensaryError) return `Error: ${dispensaryError}`;

  // Check if the user is already enrolled in notifications for this dispensary
  const isUserEnrolled = dispensary.userStrains.some(us => us.userId === user?.id);
  const strains = dispensary?.strains;

  return (
    <div className="p-4">
      {/* Dispensary name display */}
      <h1 className="text-2xl font-bold mb-4">
        {dispensaryName.charAt(0).toUpperCase() + dispensaryName.slice(1)} {isUserEnrolled ? "✅" : " "}
      </h1>

      {/* Login button for non-authenticated users */}
      {!user ? (
        <Stack direction="row" spacing={4}>
          <Link to="/login">
            <Button leftIcon={<IoMdLogIn />} colorScheme="blue" variant="solid">
              Login
            </Button>
          </Link>
        </Stack>
      ) : (
        // Strain notification settings for logged-in users
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Strain Notifications:</h2>
          <ul className="list-disc list-inside">
            {strains?.map(i => (
              <div key={i.strain.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={notificationSettings.includes(i.strain.id)}
                  onChange={e => handleChange(i.strain.id, e.target.checked)}
                />
                <label>{i.strain.name}</label>
              </div>
            ))}
          </ul>
          <Button
            colorScheme="blue"
            onClick={handleEnrollOrUpdate}
            leftIcon={<GrUpdate />}
            variant="solid"
            className="mt-2"
          >
            {isUserEnrolled ? "Update" : "Enroll"}
          </Button>
        </div>
      )}

      {/* Display list of all dispensary strains */}
      <h2 className="text-xl font-bold mt-6">Strains:</h2>
      <ul className="list-disc list-inside">
        {strains?.map(i => (
          <li key={i.strain.id} className="list-none my-2">
            <div>
              {(i.available ? "✅ " : "⏰ ") + i.strain.name + " (" + i.strain.grower + ") - "}
              <span className={i.available ? "text-green-500" : "text-red-500"}>
                {i.available ? "Dropped " : "Last Seen "}
                {new Date(i.availableDate).toLocaleDateString()}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
