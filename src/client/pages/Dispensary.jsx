import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@wasp/queries';
import { useAction } from '@wasp/actions';
import getDispensary from '@wasp/queries/getDispensary';
import getStrains from '@wasp/queries/getStrains';
import enrollUser from '@wasp/actions/enrollUser';

export function DispensaryPage() {
  const { dispensaryName } = useParams();
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationSettings, setNotificationSettings] = useState('');
  const { data: dispensary, isLoading: dispensaryLoading, error: dispensaryError } = useQuery(getDispensary, { name: dispensaryName });
  const { data: strains, isLoading: strainsLoading, error: strainsError } = useQuery(getStrains, { dispensaryId: dispensary?.id });
  const enrollUserFn = useAction(enrollUser);

  const handleEnrollUser = () => {
    enrollUserFn({
      userId: 1, // Change this to the actual user ID
      strainId: 1, // Change this to the selected strain ID
      notificationSettings: notificationSettings
    });
  };

  if (dispensaryLoading || strainsLoading) return 'Loading...';
  if (dispensaryError || strainsError) return 'Error: ' + (dispensaryError || strainsError);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">{dispensary?.name}</h1>
      <p className="mb-2">Enter your phone number to receive notifications:</p>
      <input
        type="text"
        placeholder="Phone number"
        className="px-2 py-1 border rounded mb-4"
        value={phoneNumber}
        onChange={(e) => setPhoneNumber(e.target.value)}
      />
      <p className="mb-2">Select notification settings:</p>
      <input
        type="text"
        placeholder="Notification settings"
        className="px-2 py-1 border rounded mb-4"
        value={notificationSettings}
        onChange={(e) => setNotificationSettings(e.target.value)}
      />
      <button
        onClick={handleEnrollUser}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Enroll
      </button>
      <h2 className="text-xl font-bold mt-6">Available Strains:</h2>
      {strains?.map((strain) => (
        <div key={strain.id} className="p-2 bg-gray-100 rounded-lg mt-4">
          <h3 className="text-lg font-bold mb-2">{strain.name}</h3>
          <p>{strain.description}</p>
        </div>
      ))}
    </div>
  );
}