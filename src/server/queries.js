import HttpError from '@wasp/core/HttpError.js'

export const getDispensary = async ({ name }, context) => {
  // if (!context.user) { throw new HttpError(401) };

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name },
    include : {
      users: {
        include: {
          user: true,
        }
      },
      strains: {
        include: {
          strain: true,
        }
      }
    }
  });

  if (!dispensary) throw new HttpError(404, 'No dispensary with name ' + name);

  // console.log('dispensary', dispensary);

  return dispensary;
}

export const getStrains = async ({ dispensaryName }, context) => {
  if (!context.user) { throw new HttpError(401) };

  console.log('dispensaryName', dispensaryName);

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { dispensaryName },
  });
  // console.log('dispensary', dispensary);
  return dispensary.strains;
}

export const getUser = async ({ id }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const user = await context.entities.User.findUnique({
    where: { id },
    include : {
      dispensaries: {
        include: {
          dispensary: true,
        }
      },
      strains: {
        include: {
          strain: true,
        }
      },
    }

  });

  if (!user) throw new HttpError(404, 'No user with username ' + username);

  // console.log('user', user);

  return user;
}