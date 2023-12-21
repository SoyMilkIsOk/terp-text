import HttpError from '@wasp/core/HttpError.js'

export const getDispensary = async ({ name }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name },
  });

  if (!dispensary) throw new HttpError(404, 'No dispensary with name ' + name);

  console.log('dispensary', dispensary);

  return dispensary;
}

export const getStrains = async ({ dispensaryName }, context) => {
  if (!context.user) { throw new HttpError(401) };

  console.log('dispensaryName', dispensaryName);

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { dispensaryName },
  });
  console.log('dispensary', dispensary);
  return dispensary.strains;
}