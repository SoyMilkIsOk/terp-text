import HttpError from '@wasp/core/HttpError.js'

export const getDispensary = async ({ name }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name },
  });

  if (!dispensary) throw new HttpError(404, 'No dispensary with name ' + name);

  return dispensary;
}

export const getStrains = async ({ dispensaryName }, context) => {
  if (!context.user) { throw new HttpError(401) };

  const dispensary = await context.entities.Dispensary.findUnique({
    where: { name: dispensaryName },
  });

  if (!dispensary) throw new HttpError(404, 'No dispensary with name ' + dispensaryName);

  const strains = await context.entities.Strain.findMany({
    where: { dispensaryId: dispensary.id }
  });

  return strains;
}