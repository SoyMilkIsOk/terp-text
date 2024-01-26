import HttpError from "@wasp/core/HttpError.js";
import { Prisma } from "@prisma/client";
import { emailSender } from "@wasp/email/index.js";

export const createUser = async (args, context) => {
  const { email, password, phone } = args;

  const user = await context.entities.User.create({
    data: {
      email,
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

  const currentDate = new Date();

  const strain = await context.entities.DispensaryStrain.updateMany({
    where: {
      strainName,
      dispensarySlug,
    },
    data: {
      available,
      availableDate: currentDate,
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

export const createDispensaryStrain = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to add a dispensary");
  }

  const { dispensarySlug, strainName } = args;

  const dispensary = await context.entities.DispensaryStrain.create({
    data: {
      dispensarySlug,
      strainName,
    },
  });

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

export const sendStrainNotification = async (args, context) => {
  if (!context.user) {
    throw new HttpError(401, "Must be logged in to send a notification");
  }

  const { dispensarySlug, strainId } = args;

  const userStrains = await context.entities.UserStrain.findMany({
    where: {
      dispensarySlug,
      strainId,
    },
    include: {
      user: true,
    },
  });

  const users = userStrains.map((userStrain) => userStrain.user);

  if (users.length === 0) {
    console.log("No users to notify");
    throw new HttpError(404, "No users to notify");
  }

  // get dispensary and strain information for email/text message content

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { slug: dispensarySlug },
  });

  const strain = await context.entities.Strain.findUnique({
    where: { id: strainId },
  });

  /// send notification to users via text and email here
  /// check user.notificationSettings to see if they want to be notified via text or email or both 
  /// and then do that with SendGrid and Twilio

  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    if (user.notificationType === null) {
      console.log("No notification settings for user " + user.id);
      continue;
    }
    console.log("Sending notification(s) to user " + user.id);
    if (user.notificationType.includes("text")) {
      console.log("Sending text to " + user.phone);

    }
    if (user.notificationType.includes("email")) {
      console.log("Sending email to " + user.email);
      const info = await emailSender.send({
        from: {
          name: "TerpText",
          email: "terps@terpmetrix.com",
        },
        to: user.email,
        subject: "TerpText Notification for " + strain.name + " @ " + dispensary.name,
        text: "TerpText Notification for " + strain.name + " @ " + dispensary.name,
        html: "TerpText Notification for " + strain.name + " @ " + dispensary.name,
      });

    }
  }

  return users;
}
