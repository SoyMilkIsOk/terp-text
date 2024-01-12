import React from "react";
import { Link } from "react-router-dom";
import useAuth from "@wasp/auth/useAuth";
import { useQuery } from "@wasp/queries";
import getAllDispensaries from "@wasp/queries/getAllDispensaries";

export const Home = () => {
  const { data: user } = useAuth();
  const { data: dispensaries } = useQuery(getAllDispensaries);
  return (
    <div>
      <h1>All Dispensaries</h1>
      {/* list of all dispensaries, linked to their respective pages */}
      <ul>
        {dispensaries?.map((dispensary) => (
          <li key={dispensary.id} className="text-xl2 underline color-blue">
            <Link to={`/${dispensary.name}`}>
              {/* capitalized dispensary name */}
              {dispensary.name.charAt(0).toUpperCase() +
                dispensary.name.slice(1)}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};
