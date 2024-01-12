import React, { useState } from "react";
import useAuth from "@wasp/auth/useAuth";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getDispensary from "@wasp/queries/getDispensary";
// import getUser from "@wasp/queries/getUser";
import enrollUser from "@wasp/actions/enrollUser";
import { Button, Stack } from "@chakra-ui/react";
import { IoMdLogIn } from "react-icons/io";
import { GrUpdate } from "react-icons/gr";

export function DispensaryPage() {
  // get dispensary name from url
  const { dispensaryName } = useParams();

  //get user data
  const { data: user } = useAuth();

  // get users strains and dispensary notification settings
  // const {
  //   data: userData,
  //   isLoading: userLoading,
  //   error: userError,
  // } = useQuery(getUser, { id: user?.id });

  // array to be used to update user notification settings
  const [notificationSettings, setNotificationSettings] = useState([]);

  // get dispensary data
  const {
    data: dispensary,
    isLoading: dispensaryLoading,
    error: dispensaryError,
  } = useQuery(getDispensary, { name: dispensaryName });

  // get strains from dispensary obj and map over them to array for display
  const strains = dispensary?.strains;

  // convery dispensary name to capitalized case
  const dispensaryNameCapitalized =
    dispensaryName.charAt(0).toUpperCase() + dispensaryName.slice(1);

  const enrollUserFn = useAction(enrollUser);

  const handleEnrollUser = () => {
    //call enrollUser action and handle error + success using hooks
    enrollUserFn({
      dispensaryName,
      notificationSettings,
    })
      .then(() => {
        alert("Success!");
      })
      .catch((err) => {
        console.log(err);
        alert("Error: " + err.message);
      });
  };

  if (dispensaryLoading) return "Loading...";
  if (dispensaryError) return "Error: " + dispensaryError;

  // console.log(dispensary);

  return (
    <div className="p-4">
      {/* if user is enrolled to dispensary notifications, add ✅ next to name*/}
      {/* {users.user.includes(user.id) && <p>✅</p>} */}
      <h1 className="text-2xl font-bold mb-4">
        {dispensaryNameCapitalized}{" "}
        {(dispensary.userStrains.find((i) => i.userId === user?.id) && "✅") ||
          ""}{" "}
      </h1>

      {/* if user is not logged in, show link to login/signup */}
      {!user && (
        <Stack direction="row" spacing={4}>
          <Link to="/login">
            <Button leftIcon={<IoMdLogIn />} colorScheme="blue" variant="solid">
              Login
            </Button>
          </Link>
        </Stack>
      )}

      {/* map check box selector for all available strains */}
      {/* if logged in show, if not, do not */}
      {user && (
        <div className="mt-4">
          <h2 className="text-xl font-bold mb-2">Strain Notifcations:</h2>
          <ul className="list-disc list-inside">
            {strains?.map((i) => (
              <div key={i.strain.id} className="flex items-center mb-2">
                <input
                  type="checkbox"
                  className="mr-2"
                  value={i.strain.id}
                  // list should update with strain id on check, only if not already in list
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNotificationSettings([
                        ...notificationSettings,
                        e.target.value,
                      ]);
                    } else {
                      setNotificationSettings(
                        notificationSettings.filter(
                          (item) => item !== e.target.value
                        )
                      );
                    }
                  }}
                  // checked={userData?.strains.includes(i.strain.id)}
                />
                <label>{i.strain.name}</label>
              </div>
            ))}
          </ul>
          {/* enroll button */}
          <Button
            colorScheme="blue"
            onClick={handleEnrollUser}
            leftIcon={<GrUpdate />}
            variant="solid"
            className="mt-2"
          >
            Enroll
          </Button>
        </div>
      )}

      {/* list of all dispensary strains, if available, text green, if not, text red  */}
      <h2 className="text-xl font-bold mt-6">Strains:</h2>
      <ul className="list-disc list-inside">
        {strains?.map((i) => (
          <li key={i.strain.id} className=" list-none my-2">
            <div>
              {(i.available ? "✅ " : "⏰ ") +
                i.strain.name +
                " (" +
                i.strain.grower +
                ") - "}
              {/* display last available time MM-DD-YY */}
              {i.available && (
                <span className="text-green-500">
                  Dropped {new Date(i.availableDate).toLocaleDateString()}
                </span>
              )}
              {/* display last unavailable time MM-DD-YY */}
              {!i.available && (
                <span className="text-red-500">
                  Last Seen {new Date(i.availableDate).toLocaleDateString()}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
