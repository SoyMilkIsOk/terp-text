import HttpError from "@wasp/core/HttpError.js";
import { Prisma } from "@prisma/client";

// export const enrollUser = async (args, context) => {
//   if (!context.user) {
//     throw new HttpError(
//       401,
//       "Must be logged in to enroll in dispensary notifications"
//     );
//   }
//   const { dispensaryName, notificationSettings } = args;
//   const id = context.user.id;
//   // get user info to check if user is already enrolled in dispensary & strains
//   const user = await context.entities.User.findUnique({
//     where: { id },
//     include: {
//       dispensaries: {
//         include: {
//           dispensary: true,
//         },
//       },
//       strains: {
//         include: {
//           strain: true,
//           dispensary: true,
//         },
//       },
//     },
//   });
//   // if dispensary is not in user's dispensaries (if user has dispensaries), add dispensary to user's dispensaries (create DispensaryUser record)
//   if (!user.dispensaries) {
//     try {
//       await context.entities.User.update({
//         where: { id },
//         data: {
//           dispensaries: {
//             create: {
//               dispensaryName,
//               id,
//             },
//           },
//         },
//       });
//     } catch (e) {
//       if (e instanceof Prisma.PrismaClientKnownRequestError) {
//         if (e.code === "P2002") {
//           console.log(
//             `DispensaryUser record with userId ${id} and dispensaryName ${dispensaryName} already exists.`
//           );
//         }
//       }
//       throw e;
//     }
//   } else {
//     if (user.dispensaries.find((d) => d.dispensaryName === dispensaryName)) {
//       // console.log("user enrolled in dispesnary"); do nothing...
//     } else {
//       try {
//         await context.entities.DispensaryUser.create({
//           //enroll user in dispensary
//           data: {
//             userId: context.user.id,
//             dispensaryName,
//           },
//         });
//       } catch (e) {
//         if (e instanceof Prisma.PrismaClientKnownRequestError) {
//           if (e.code === "P2002") {
//             console.log(
//               `DispensaryUser record with userId ${id} and dispensaryName ${dispensaryName} already exists.`
//             );
//           }
//         }
//         throw e;
//       }
//     }
//   }
//   // first check if user has strains, if not add them all, else:
//   // parse notificationsettings list (for strain ids) ->
//   // check each strain id against user's strains ->
//   // if strain is not in user's strains, add strain to user's strains (create specific UserStrain record)
//   // if strain is in users strain, check to see if dispensary is in that UserStrain record (if not, add it)
//   // if strain is in users strain list and dispensary is in that UserStrain record, do nothing
//   if (!user.strains) {
//     for (let i = 0; i < notificationSettings.length; i++) {
//       try {
//         await context.entities.UserStrain.create({
//           data: {
//             userId: context.user.id,
//             strainId: parseInt(notificationSettings[i]),
//             dispensaryName,
//           },
//         });
//       } catch (e) {
//         if (e instanceof Prisma.PrismaClientKnownRequestError) {
//           if (e.code === "P2002") {
//             console.log(
//               `UserStrain record with userId ${id} and strainId ${notificationSettings[i]} and dispensaryName ${dispensaryName} already exists.`
//             );
//           }
//         }
//         throw e;
//       }
//     }
//   } else {
//     // user has strains
//     for (let i = 0; i < notificationSettings.length; i++) {
//       if (
//         !user.strains.find(
//           (s) => s.strainId === parseInt(notificationSettings[i])
//         ) // if strain is not in user's strains
//       ) {
//         try {
//           await context.entities.UserStrain.create({
//             data: {
//               userId: context.user.id,
//               strainId: parseInt(notificationSettings[i]),
//               dispensaryName,
//             },
//           });
//         } catch (e) {
//           if (e instanceof Prisma.PrismaClientKnownRequestError) {
//             if (e.code === "P2002") {
//               console.log(
//                 `UserStrain record with userId ${id} and strainId ${notificationSettings[i]} and dispensaryName ${dispensaryName} already exists.`
//               );
//             }
//           }
//           throw e;
//         }
//       } else {
//         if (
//           !user.strains.find(
//             (s) =>
//               s.strainId === parseInt(notificationSettings[i]) &&
//               s.dispensaryName === dispensaryName
//           ) // if strain is in user's strains but dispensary is not in that strain's dispensaries
//         ) {
//           try {
//             await context.entities.UserStrain.create({
//               data: {
//                 userId: context.user.id,
//                 strainId: parseInt(notificationSettings[i]),
//                 dispensaryName,
//               },
//             });
//           } catch (e) {
//             if (e instanceof Prisma.PrismaClientKnownRequestError) {
//               if (e.code === "P2002") {
//                 console.log(
//                   `UserStrain record with userId ${id} and strainId ${notificationSettings[i]} and dispensaryName ${dispensaryName} already exists.`
//                 );
//               }
//             }
//             throw e;
//           }
//         }
//       }
//     }
//   }
//   return;
// };

export const enrollUser = async (args, context) => {
  // simplified version of enrollUser that tries to add every notification setting to the user's strains, throws back errors if fails on any
  if (!context.user) {
    throw new HttpError(
      401,
      "Must be logged in to enroll in dispensary notifications"
    );
  }

  const { dispensaryName, notificationSettings } = args;
  const id = context.user.id;
  var errorFlag = false;

  // try adding all, throw error if any fail

  console.log("notificationSettings", notificationSettings);

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
  if (errorFlag) {
    throw new HttpError(500, "Error adding some or all notification settings");
  }
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
