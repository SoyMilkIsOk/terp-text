import HttpError from '@wasp/core/HttpError.js'

export const enrollUser = async (args, context) => {
  if (!context.user) { throw new HttpError(401) };

  const { userId, strainId, notificationSettings } = args;

  const existingUserStrain = await context.entities.UserStrain.findFirst({
    where: {
      userId: userId,
      strainId: strainId
    }
  });

  if (existingUserStrain) {
    await context.entities.UserStrain.update({
      where: { id: existingUserStrain.id },
      data: { notificationSettings: notificationSettings }
    });
  } else {
    await context.entities.UserStrain.create({
      data: {
        user: { connect: { id: userId } },
        strain: { connect: { id: strainId } },
        notificationSettings: notificationSettings
      }
    });
  }

  return true;
}

export const sendNotification = async ({ dispensaryId, strainId }, context) => {
  const dispensary = await context.entities.Dispensary.findUnique({
    where: { id: dispensaryId }
  });

  const strain = await context.entities.Strain.findUnique({
    where: { id: strainId }
  });

  const users = await context.entities.User.findMany({
    where: {
      userStrains: {
        some: {
          strainId: strainId,
          dispensaryId: dispensaryId
        }
      }
    }
  });

  const notificationPromises = users.map(async user => {
    // Send notification to user
    // ... replace with real implementation 
    return sendTextNotification(user.phoneNumber, `New strain ${strain.name} available at ${dispensary.name}`);
  });

  await Promise.all(notificationPromises);

  return "Notifications sent";
}