import {createDispensary} from "./actions.js";
import {createStrain} from "./actions.js";
import {createUser} from "./actions.js";
import {linkStrain} from "./actions.js";


export const devSeed = async(prismaClient) => {
  const context = {
    entities: prismaClient,
  };

  const user1 = await createUser( 
    {
      username: "sam",
      password: "password1",
      phone: "301-525-4028",
    },
    context
  );

  const user2 = await createUser(
    {
      username: "maikoh",
      password: "password1",
      phone: "301-525-4029",
    },
    context
  );
  
  const user3 = await createUser(
    {
      username: "eclipse",
      password: "password1",
      phone: "301-525-4030",
    },
    context
  );

  const dispensary1 = await createDispensary(
    {
      name: "Maikoh Holistics",
      slug: "maikoh",
      phone: "415-648-4420",
      website: "https://www.thegreencross.org/1",
    },
    context
  );

  const dispensary2 = await createDispensary(
    {
      name: "Ecplise Cannabis Company",
      slug: "ecplise",
      phone: "415-648-4421",
      website: "https://www.thegreencross.org/2",
    },
    context
  );

  const strain1 = await createStrain(
    {
      name: "Blue Dream",
      grower: "Malek's"
    },
    context
  );

  const strain2 = await createStrain(
    {
      name: "Sour Diesel",
      grower: "Malek's"
    },
    context
  );

  const strain3 = await createStrain(
    {
      name: "Super Lemon Haze",
      grower: "Verde"
    },
    context
  );

  const link1 = await linkStrain(
    {
      dispensarySlug: "maikoh",
      strainName: "Blue Dream",
      available: true,
    },
    context
  );

  const link2 = await linkStrain(
    {
      dispensarySlug: "maikoh",
      strainName: "Sour Diesel",
      available: true,
    },
    context
  );

  const link3 = await linkStrain(
    {
      dispensarySlug: "ecplise",
      strainName: "Super Lemon Haze",
      available: false,
    },
    context
  );

  const link4 = await linkStrain(
    {
      dispensarySlug: "ecplise",
      strainName: "Blue Dream",
      available: true,
    },
    context
  );

};

