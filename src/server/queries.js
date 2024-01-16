import HttpError from "@wasp/core/HttpError.js";

export const getDispensary = async ({ name }, context) => {
  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name },
    include: {
      strains: {
        include: {
          strain: true,
        },
      },
      userStrains: true,
    },
  });

  if (!dispensary) throw new HttpError(404, "No dispensary with name " + name);

  return dispensary;
};

export const getAllDispensaries = async (args, context) => {
  const dispensaries = await context.entities.Dispensary.findMany({
    include: {
      strains: {
        include: {
          strain: true,
        },
      },
      userStrains: true,
    },
  });

  // console.log('dispensaries', dispensaries);

  return dispensaries;
};

export const getStrains = async ({ name }, context) => {

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name },
    include: {
      strains: {
        include: {
          strain: true,
        },
      },
    },
  });

  return dispensary.strains;
};

export const getUser = async ({ username }, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const user = await context.entities.User.findUnique({
    where: { username },
    include: {
      strains: {
        include: {
          strain: true,
          dispensary: true,
        },
      },
    },
  });

  if (!user) throw new HttpError(404, "No user with username " + username);

  // console.log('user', user);

  return user;
};
