import HttpError from "@wasp/core/HttpError.js";
import { Prisma } from "@prisma/client";

export const addStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to add a strain");
  }

  const { name, dispensaryName } = args;

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name: dispensaryName },
  });

  if (!dispensary) {
    throw new HttpError(404, "No dispensary with name " + dispensaryName);
  }

  const strain = await context.entities.DispensaryStrain.create({
    data: {
      name,
      dispensaryName,
    },
  });

  return strain;
}

export const deleteStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to delete a strain");
  }

  const { strainName, dispensaryName } = args;

  console.log("name", strainName);
  console.log("dispensaryName", dispensaryName);
  const name = dispensaryName;

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name },

  });

  if (!dispensary) {
    throw new HttpError(404, "No dispensary with name " + dispensaryName);
  }

  const strain = await context.entities.DispensaryStrain.deleteMany({
    where: {
      strainName,
      dispensaryName,
    },
  });

  return strain;
}

export const updateStrainAvailability = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to update a strain");
  }

  const { strainName, dispensaryName, available } = args;

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name: dispensaryName },
  });

  if (!dispensary) {
    throw new HttpError(404, "No dispensary with name " + dispensaryName);
  }

  const strain = await context.entities.DispensaryStrain.updateMany({
    where: {
      strainName,
      dispensaryName,
    },
    data: {
      available,
    },
  });  

  return strain;
}

export const deleteUserStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to delete a strain");
  }

  const { strainId, dispensaryName } = args;

  const strain = await context.entities.UserStrain.deleteMany({
    where: {
      strainId,
      userId: context.user.id,
      dispensaryName,
    },
  });

  return strain;
}

export const createUserStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to add a strain");
  }

  const { strainId, dispensaryName } = args;

  const strain = await context.entities.UserStrain.create({
    data: {
      userId: context.user.id,
      strainId,
      dispensaryName,
    },
  });

  return strain;
}

export const deleteUserDispensary = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to delete a dispensary");
  }

  const { dispensaryName } = args;

  const dispensary = await context.entities.UserStrain.deleteMany({
    where: {
      userId: context.user.id,
      dispensaryName,
    },
  });

  return dispensary;
}

export const createUserDispensary = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to add a dispensary");
  }

  const { dispensaryName } = args;

  dispensary = await context.entities.Dispensary.findUnique({
    where: { name: dispensaryName },
  });

  if (!dispensary) {
    throw new HttpError(404, "No dispensary with name " + dispensaryName);
  }

  // for every strain at dispensary, add a userStrain for this user
  for (let i = 0; i < dispensary.strains.length; i++) {
    try {
      await context.entities.UserStrain.create({
        data: {
          userId: context.user.id,
          strainId: dispensary.strains[i].id,
          dispensaryName,
        },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        if (e.code === "P2002") {
          console.log(
            `UserStrain record with userId ${id} and strainId ${notificationSettings[i]} and dispensaryName ${dispensaryName} already exists.`
          );
        }
        errorFlag = true;
      }
    }
  }

  return dispensary;
}

export const unsubscribeFromTexts = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to unsubscribe from texts");
  }

  const user = await context.entities.UserStrain.deleteMany({
    where: {
      userId: context.user.id,
    },
  });

  return user;
}

export const updatePhone = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to update phone");
  }

  const { phone } = args;

  const user = await context.entities.User.update({
    where: {
      id: context.user.id,
    },
    data: {
      phone,
    },
  });

  return user;
}
