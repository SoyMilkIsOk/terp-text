import React, { useState } from "react";
import useAuth from "@wasp/auth/useAuth";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@wasp/queries";
import { useAction } from "@wasp/actions";
import getDispensary from "@wasp/queries/getDispensary";
// import getUser from "@wasp/queries/getUser";
import enrollUser from "@wasp/actions/enrollUser";

export function DispensaryPage() {

  // get dispensary name from url
  const { dispensaryName } = useParams();

  //get user phone number and autofill if logged in
  const { data: user } = useAuth();
  const [phoneNumber, setPhoneNumber] = useState("");

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
    enrollUserFn({
      dispensaryName: dispensaryName,
      notificationSettings: notificationSettings,
    });
  };

  if (dispensaryLoading) return "Loading...";
  if (dispensaryError) return "Error: " + dispensaryError;

  // console.log(userData);

  return (
    <div className="p-4">
      {/* if user is enrolled to dispensary notifications, add ✅ next to name*/}
      {/* {console.log(user)} */}
      {/* {users.user.includes(user.id) && <p>✅</p>} */}
      <h1 className="text-2xl font-bold mb-4">{dispensaryNameCapitalized}</h1>

      {/* Phone number input */}
      <p className="mb-2">Enter your phone number to receive notifications:</p>
      <input
        type="text"
        placeholder={user?.phone || "Enter phone number"}
        className="px-2 py-1 border rounded mb-4"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />

      {/* map check box selector for all available strains */}
      <p className="mb-2">Select strains to be notified for:</p>
      {strains?.map((i) => (
        <div key={i.strain.id} className="flex items-center mb-2">
          <input
            type="checkbox"
            className="mr-2"
            value={i.strain.id}
            onChange={(e) => setNotificationSettings(e.target.value)}
            // checked={userData?.strains.includes(i.strain.id)}
          />
          <label>{i.strain.name}</label>
        </div>
      ))}

      {/* enroll button */}
      <button
        onClick={handleEnrollUser}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Enroll
      </button>

      {/* list of all dispensary strains, if available, text green, if not, text red  */}
      <h2 className="text-xl font-bold mt-6">All Strains:</h2>
      <ul className="list-disc list-inside">
        {strains?.map((i) => (
          <li
            key={i.strain.id}
            className={i.available ? "text-green-500" : "text-red-500"}
          >
            {i.strain.name}
          </li>
        ))}
      </ul>
    </div>
  );
}
