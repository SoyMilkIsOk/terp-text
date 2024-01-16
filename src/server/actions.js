import HttpError from "@wasp/core/HttpError.js";
import { Prisma } from "@prisma/client";

export const enrollUser = async (args, context) => {
  // simplified version of enrollUser that tries to add every notification setting to the user's strains, throws back errors if fails on any
  if (!context.user) {
    throw new HttpError(
      401,
      "Must be logged in to enroll in dispensary notifications"
    );
  }

  const { dispensaryName, notificationSettings, update } = args;
  const id = context.user.id;
  var errorFlag = false;

  // try adding all, throw error if any fail

  console.log("notificationSettings", notificationSettings);

  if (!update) {

  for (let i = 0; i < notificationSettings.length; i++) {
    try {
      await context.entities.UserStrain.create({
        data: {
          userId: context.user.id,
          strainId: parseInt(notificationSettings[i]),
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
  // if (errorFlag) {
  //   throw new HttpError(500, "Error adding some or all notification settings");
  // }

  } else {
    // if update is set, delete all existing userStrains for this user that match the dispensaryName
    // then add all new ones back that are in the notificationSettings array

    try {
      await context.entities.UserStrain.deleteMany({
        where: {
          userId: context.user.id,
          dispensaryName,
        },
      });
      console.log("Deleted userStrains for user", context.user.id, "dispensaryName", dispensaryName);
    }
    catch (e) {
      console.log("Error deleting userStrains for user", context.user.id, "dispensaryName", dispensaryName);
      errorFlag = true;
    }

    for (let i = 0; i < notificationSettings.length; i++) {
      try {
        await context.entities.UserStrain.create({
          data: {
            userId: context.user.id,
            strainId: parseInt(notificationSettings[i]),
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
  }

  if (errorFlag) {
    throw new HttpError(500, "Error adding some or all notification settings");
  }

};

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
