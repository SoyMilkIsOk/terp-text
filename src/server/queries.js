import HttpError from "@wasp/core/HttpError.js";

export const getDispensary = async ({ slug }, context) => {
  const dispensary = await context.entities.Dispensary.findUnique({
    where: { slug },
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
          strain: {
            include: {
              dispensaries: true,
            },
          },
        },
      },
      userStrains: true,
    },
  });

  return dispensaries;
};

export const getAllStrains = async (args, context) => {
  const strains = await context.entities.Strain.findMany({
    include: {
      dispensaries: {
        include: {
          dispensary: true,
        },
      },
    },
  });

  return strains;
};

export const getStrains = async ({ slug }, context) => {
  const dispensary = await context.entities.Dispensary.findUnique({
    where: { slug },
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

  return user;
};
