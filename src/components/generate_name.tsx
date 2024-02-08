import { uniqueNamesGenerator, Config, names, animals } from 'unique-names-generator';

const customConfig: Config = {
  dictionaries: [animals, names],
  length: 1,
};

export const generateRandomName = (seed: string): string => {
  const uniqueConfig: Config = {
    dictionaries: [names, animals],
    length: 1,
    seed: seed,
  };

  return uniqueNamesGenerator(uniqueConfig);
};

export const generateShortName = (): string => {
  return uniqueNamesGenerator(customConfig);
};