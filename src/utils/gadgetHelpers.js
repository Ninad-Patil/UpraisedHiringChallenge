export const getRandomProbability = () => Math.floor(Math.random() * 101);

export const generateRandomCodenames = () => {
  const codenames = ["The Nightingale", "The Kraken", "Shadow Blade", "Ghost"];
  return codenames[Math.floor(Math.random() * codenames.length)];
};

export const generateConfirmationCode = () =>
  Math.floor(100000 + Math.random() * 900000);

export const validStatuses = [
  "Available",
  "Deployed",
  "Destroyed",
  "Decommissioned",
];
