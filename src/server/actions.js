import HttpError from "@wasp/core/HttpError.js";
import { error } from "console";

export const enrollUser = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401);
  }

  const { dispensaryName, notificationSettings } = args;
  const id = context.user.id;

  // Check if user is already enrolled in dispensary
  const user = await context.entities.User.findUnique({
    where: { id },
    include: {
      dispensaries: {
        include: {
          dispensary: true,
        },
      },
      strains: {
        include: {
          strain: true,
          dispensary: true,
        },
      },
    },
  });

  // if dispensary is not in user's dispensaries (if user has dispensaries), add dispensary to user's dispensaries (create DispensaryUser record)
  if (!user.dispensaries) {
    await context.entities.User.update({
      where: { id },
      data: {
        dispensaries: {
          create: {
            dispensaryName,
            id,
          },
        },
      },
    });
  } else {
    if (user.dispensaries.find((d) => d.dispensaryName === dispensaryName)) {
      console.log("user enrolled in dispesnary");
    } else {
      await context.entities.DispensaryUser.create({
        data: {
          userId: context.user.id,
          dispensaryName,
        },
      });
    }
  }

  // first check if user has strains, if not add them all, else:
  // parse notificationsettings list (for strain ids) ->
  // check each strain id against user's strains ->
  // if strain is not in user's strains, add strain to user's strains (create specific UserStrain record)
  // if strain is in users strain, check to see if dispensary is in that UserStrain record (if not, add it)
  // if strain is in users strain list and dispensary is in that UserStrain record, do nothing

  if (!user.strains) {
    for (let i = 0; i < notificationSettings.length; i++) {
      await context.entities.UserStrain.create({
        data: {
          userId: context.user.id,
          strainId: parseInt(notificationSettings[i]),
          dispensaryName,
        },
      });
    }
  } else {
    for (let i = 0; i < notificationSettings.length; i++) {
      if (
        !user.strains.find((s) => s.strainId === notificationSettings[i]) // if strain is not in user's strains
      ) {
        await context.entities.UserStrain.create({
          data: {
            userId: context.user.id,
            strainId: parseInt(notificationSettings[i]),
            dispensaryName,
          },
        });
      } else {
        if (
          !user.strains.find(
            (s) =>
              s.strainId === notificationSettings[i] && s.dispensaryName === dispensaryName
          ) // if strain is in user's strains but dispensary is not in that strain's dispensaries
        ) {
          await context.entities.UserStrain.create({
            data: {
              userId: context.user.id,
              strainId: parseInt(notificationSettings[i]),
              dispensaryName,
            },
          });
        }
      }
    }
  }

  console.log("created strain linking records");

  return error;
};

export const sendNotification = async ({ dispensaryId, strainId }, context) => {
  const dispensary = await context.entities.Dispensary.findUnique({
    where: { id: dispensaryId },
  });

  const strain = await context.entities.Strain.findUnique({
    where: { id: strainId },
  });

  const users = await context.entities.User.findMany({
    where: {
      userStrains: {
        some: {
          strainId: strainId,
          dispensaryId: dispensaryId,
        },
      },
    },
  });

  const notificationPromises = users.map(async (user) => {
    // Send notification to user
    // ... replace with real implementation
    return sendTextNotification(
      user.phoneNumber,
      `New strain ${strain.name} available at ${dispensary.name}`
    );
  });

  await Promise.all(notificationPromises);

  return "Notifications sent";
};
