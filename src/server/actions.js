import HttpError from "@wasp/core/HttpError.js";
import { Prisma } from "@prisma/client";

export const createUser = async (args, context) => {
  const { username, password, phone } = args;

  const user = await context.entities.User.create({
    data: {
      username,
      password,
      phone,
    },
  });

  return user;
}

export const createDispensary = async (args, context) => {

  const { name, phone, slug, website } = args;

  const dispensary = await context.entities.Dispensary.create({
    data: {
      name,
      phone,
      slug,
      website,
    },
  });

  return dispensary;
}

export const createStrain = async (args, context) => {

  const { name, grower } = args;

  const strain = await context.entities.Strain.create({
    data: {
      name,
      grower,
    },
  });

  return strain;
}

export const deleteStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to delete a strain");
  }

  const { strainName, dispensarySlug } = args;

  const slug = dispensarySlug;

  const strain = await context.entities.DispensaryStrain.deleteMany({
    where: {
      strainName,
      dispensarySlug,
    },
  });

  return strain;
}

export const linkStrain = async (args, context) => {
  
    const { strainName, dispensarySlug, available } = args;
  
    const strain = await context.entities.DispensaryStrain.create({
      data: {
        strainName,
        dispensarySlug,
        available,
      },
    });
  
    return strain;
  }

export const updateStrainAvailability = async (args, context) => {

  const { strainName, dispensarySlug, available } = args;

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { slug: dispensarySlug },
  });

  if (!dispensary) {
    throw new HttpError(404, "No dispensary with name " + dispensaryName);
  }

  const strain = await context.entities.DispensaryStrain.updateMany({
    where: {
      strainName,
      dispensarySlug,
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

  const { strainId, dispensarySlug } = args;

  const strain = await context.entities.UserStrain.deleteMany({
    where: {
      strainId,
      userId: context.user.id,
      dispensarySlug,
    },
  });

  return strain;
}

export const createUserStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to add a strain");
  }

  const { strainId, dispensarySlug } = args;

  const strain = await context.entities.UserStrain.create({
    data: {
      userId: context.user.id,
      strainId,
      dispensarySlug,
    },
  });

  return strain;
}

export const deleteUserDispensary = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to delete a dispensary");
  }

  const { dispensarySlug } = args;

  const dispensary = await context.entities.UserStrain.deleteMany({
    where: {
      userId: context.user.id,
      dispensarySlug,
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
